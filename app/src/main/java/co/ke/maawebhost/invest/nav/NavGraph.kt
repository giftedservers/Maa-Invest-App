package co.ke.maawebhost.invest.nav

/**
 * RECONSTRUCTED FILE — 2026-07-31
 *
 * The original NavGraph.kt could not be recovered: the .rar archive it was
 * uploaded in had corrupted/truncated data for this specific file (both
 * `unar` and `7z` failed to extract it with a "read more data than was
 * available" error), even though every other file in the archive extracted
 * cleanly. This is a rebuild based on every screen composable's actual
 * signature (confirmed against the real, successfully-extracted screen
 * files) plus the Session/TokenStore architecture — not a recovery of the
 * original code. The overall structure (bottom-nav tabs, which screens are
 * pushed vs. tabs, the PIN-lock gate) is a reasonable reconstruction, not a
 * certainty — review the tab arrangement and adjust if it doesn't match
 * what the app previously did.
 */

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Groups
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.Savings
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import co.ke.maawebhost.invest.data.Session
import co.ke.maawebhost.invest.data.TokenStore
import co.ke.maawebhost.invest.screens.auth.LoginScreen
import co.ke.maawebhost.invest.screens.auth.PinScreen
import co.ke.maawebhost.invest.screens.auth.RegisterScreen
import co.ke.maawebhost.invest.screens.auth.WelcomeScreen
import co.ke.maawebhost.invest.screens.groups.GroupDetailScreen
import co.ke.maawebhost.invest.screens.groups.GroupsScreen
import co.ke.maawebhost.invest.screens.groups.JoinGroupScreen
import co.ke.maawebhost.invest.screens.history.TransactionHistoryScreen
import co.ke.maawebhost.invest.screens.home.HomeScreen
import co.ke.maawebhost.invest.screens.invest.InvestScreen
import co.ke.maawebhost.invest.screens.profile.MoreScreen
import co.ke.maawebhost.invest.screens.profile.ProfileScreen
import co.ke.maawebhost.invest.screens.save.CreateGoalScreen
import co.ke.maawebhost.invest.screens.save.SaveScreen
import co.ke.maawebhost.invest.screens.wallet.AddMoneyScreen
import co.ke.maawebhost.invest.screens.wallet.WalletScreen
import co.ke.maawebhost.invest.screens.wallet.WithdrawScreen
import co.ke.maawebhost.invest.ui.theme.Bg
import co.ke.maawebhost.invest.ui.theme.CardColor
import co.ke.maawebhost.invest.ui.theme.Primary
import co.ke.maawebhost.invest.ui.theme.TextFaint

private object Routes {
    const val WELCOME = "welcome"
    const val LOGIN = "login"
    const val REGISTER = "register"

    const val HOME = "home"
    const val WALLET = "wallet"
    const val SAVE = "save"
    const val INVEST = "invest"
    const val GROUPS = "groups"
    const val MORE = "more"

    const val ADD_MONEY = "add_money"
    const val WITHDRAW = "withdraw"
    const val CREATE_GOAL = "create_goal"
    const val JOIN_GROUP = "join_group"
    const val GROUP_DETAIL = "group_detail/{groupId}"
    const val PROFILE = "profile"
    const val HISTORY = "history"

    fun groupDetail(groupId: Int) = "group_detail/$groupId"
}

private data class BottomTab(
    val route: String,
    val label: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
)

private val BOTTOM_TABS = listOf(
    BottomTab(Routes.HOME, "Home", Icons.Filled.Home),
    BottomTab(Routes.WALLET, "Wallet", Icons.Filled.AccountBalanceWallet),
    BottomTab(Routes.SAVE, "Save", Icons.Filled.Savings),
    BottomTab(Routes.INVEST, "Invest", Icons.Filled.TrendingUp),
    BottomTab(Routes.GROUPS, "Groups", Icons.Filled.Groups),
    BottomTab(Routes.MORE, "More", Icons.Filled.MoreHoriz),
)

@Composable
fun MaaNavGraph() {
    val context = LocalContext.current

    LaunchedEffect(Unit) {
        TokenStore.init(context)
        Session.bootstrap()
    }

    val isLoading by Session.isLoading
    val user by Session.user
    val pinUnlocked by Session.pinUnlocked

    when {
        isLoading -> LoadingScreen()
        user == null -> AuthNavHost()
        TokenStore.getPin() != null && !pinUnlocked -> PinScreen(onUnlocked = { Session.pinUnlocked.value = true })
        else -> MainNavHost()
    }
}

@Composable
private fun LoadingScreen() {
    Box(modifier = Modifier.fillMaxSize().background(Bg), contentAlignment = Alignment.Center) {
        CircularProgressIndicator(color = Primary)
    }
}

@Composable
private fun AuthNavHost() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = Routes.WELCOME) {
        composable(Routes.WELCOME) {
            WelcomeScreen(
                onCreateAccount = { navController.navigate(Routes.REGISTER) },
                onLogin = { navController.navigate(Routes.LOGIN) },
            )
        }
        composable(Routes.LOGIN) {
            LoginScreen(
                onLoggedIn = { /* Session.user flips non-null; MaaNavGraph recomposes past this graph automatically */ },
                onGoRegister = { navController.navigate(Routes.REGISTER) },
            )
        }
        composable(Routes.REGISTER) {
            RegisterScreen(
                onRegistered = { /* same as onLoggedIn — session state drives navigation */ },
                onGoLogin = { navController.navigate(Routes.LOGIN) },
            )
        }
    }
}

@Composable
private fun MainNavHost() {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route
    val showBottomBar = BOTTOM_TABS.any { it.route == currentRoute }

    Scaffold(
        containerColor = Bg,
        bottomBar = {
            if (showBottomBar) {
                NavigationBar(containerColor = CardColor) {
                    BOTTOM_TABS.forEach { tab ->
                        NavigationBarItem(
                            selected = currentRoute == tab.route,
                            onClick = {
                                navController.navigate(tab.route) {
                                    // Standard bottom-nav behavior: don't stack
                                    // duplicate tab destinations, and return to
                                    // the same tab state when re-selecting it.
                                    popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = { Icon(tab.icon, contentDescription = tab.label) },
                            label = { Text(tab.label) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = Primary,
                                selectedTextColor = Primary,
                                unselectedIconColor = TextFaint,
                                unselectedTextColor = TextFaint,
                                indicatorColor = CardColor,
                            )
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.fillMaxSize().padding(innerPadding).background(Bg)) {
            NavHost(
                navController = navController,
                startDestination = Routes.HOME,
                modifier = Modifier.fillMaxSize()
            ) {
                composable(Routes.HOME) {
                    HomeScreen(
                        onAddMoney = { navController.navigate(Routes.ADD_MONEY) },
                        onSave = { navController.navigate(Routes.SAVE) },
                        onWithdraw = { navController.navigate(Routes.WITHDRAW) },
                        onProfile = { navController.navigate(Routes.PROFILE) },
                    )
                }
                composable(Routes.WALLET) {
                    WalletScreen(
                        onAddMoney = { navController.navigate(Routes.ADD_MONEY) },
                        onWithdraw = { navController.navigate(Routes.WITHDRAW) },
                        onHistory = { navController.navigate(Routes.HISTORY) },
                    )
                }
                composable(Routes.SAVE) {
                    SaveScreen(onCreateGoal = { navController.navigate(Routes.CREATE_GOAL) })
                }
                composable(Routes.INVEST) {
                    InvestScreen()
                }
                composable(Routes.GROUPS) {
                    GroupsScreen(
                        onOpenGroup = { groupId -> navController.navigate(Routes.groupDetail(groupId)) },
                        onJoinByCode = { navController.navigate(Routes.JOIN_GROUP) },
                    )
                }
                composable(Routes.MORE) {
                    MoreScreen(onProfile = { navController.navigate(Routes.PROFILE) })
                }

                // Pushed sub-screens — not bottom-nav tabs, reached from the
                // tabs above and popped back with the system/back-button.
                composable(Routes.ADD_MONEY) {
                    AddMoneyScreen(onDone = { navController.popBackStack() })
                }
                composable(Routes.WITHDRAW) {
                    WithdrawScreen(onDone = { navController.popBackStack() })
                }
                composable(Routes.CREATE_GOAL) {
                    CreateGoalScreen(onDone = { navController.popBackStack() })
                }
                composable(Routes.JOIN_GROUP) {
                    JoinGroupScreen(onDone = { navController.popBackStack() })
                }
                composable(
                    route = Routes.GROUP_DETAIL,
                    arguments = listOf(navArgument("groupId") { type = NavType.IntType })
                ) { entry ->
                    val groupId = entry.arguments?.getInt("groupId") ?: 0
                    GroupDetailScreen(groupId = groupId, onClose = { navController.popBackStack() })
                }
                composable(Routes.PROFILE) {
                    ProfileScreen(onBack = { navController.popBackStack() })
                }
                composable(Routes.HISTORY) {
                    TransactionHistoryScreen(onBack = { navController.popBackStack() })
                }
            }
        }
    }
}
