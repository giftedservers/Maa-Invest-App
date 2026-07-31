package co.ke.maawebhost.invest.screens.wallet

import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.PhoneAndroid
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import co.ke.maawebhost.invest.components.PrimaryButton
import co.ke.maawebhost.invest.components.ScreenHeader
import co.ke.maawebhost.invest.data.api.ApiException
import co.ke.maawebhost.invest.data.api.apiCall
import co.ke.maawebhost.invest.data.api.apiService
import co.ke.maawebhost.invest.ui.theme.*
import co.ke.maawebhost.invest.util.formatMoney
import kotlinx.coroutines.launch

private data class WMethod(val key: String, val label: String, val tag: String, val icon: androidx.compose.ui.graphics.vector.ImageVector)

private val METHODS = listOf(
    WMethod("mpesa", "M-Pesa", "Instant withdrawal", Icons.Filled.PhoneAndroid),
    WMethod("bank", "Bank Transfer", "Via KCB Funds Transfer", Icons.Filled.AccountBalance),
)

// Destination banks for the "bank" withdrawal channel — codes from KCB's own
// Funds Transfer API Appendix 2. KCB and M-Pesa (routed via KCB's Funds
// Transfer MO type) are the two most common, so they're pinned first.
private data class BankOption(val code: String, val label: String)

private val BANK_OPTIONS = listOf(
    BankOption("01", "KCB Bank"),
    BankOption("MPESA", "M-Pesa"),
    BankOption("03", "ABSA"),
    BankOption("35", "ABC Bank"),
    BankOption("26", "Access Bank"),
    BankOption("06", "Bank of Baroda"),
    BankOption("05", "Bank of India"),
    BankOption("16", "Citi Bank"),
    BankOption("11", "Co-op Bank"),
    BankOption("23", "Consolidated Bank"),
    BankOption("25", "Credit Bank"),
    BankOption("59", "Development Bank"),
    BankOption("75", "DIB Bank"),
    BankOption("63", "DTB"),
    BankOption("43", "Eco Bank"),
    BankOption("68", "Equity Bank"),
    BankOption("79", "Faulu Bank"),
    BankOption("70", "Family Bank"),
    BankOption("74", "First Community Bank"),
    BankOption("53", "GT Bank"),
    BankOption("55", "Guardian Bank"),
    BankOption("72", "Gulf African Bank"),
    BankOption("17", "Habib Bank AG Zurich"),
    BankOption("61", "Housing Finance"),
    BankOption("57", "I&M Bank"),
    BankOption("51", "Kingdom Bank"),
    BankOption("78", "KWFT"),
    BankOption("65", "Mayfair Bank"),
    BankOption("18", "Middle East Bank"),
    BankOption("14", "M-Oriental"),
    BankOption("12", "NBK"),
    BankOption("07", "NCBA"),
    BankOption("50", "Paramount Bank"),
    BankOption("99", "Post Bank"),
    BankOption("10", "Prime Bank"),
    BankOption("66", "Sidian Bank"),
    BankOption("60", "SBM Bank"),
    BankOption("49", "SPIRE Bank"),
    BankOption("31", "Stanbic Bank"),
    BankOption("02", "Stanchart"),
    BankOption("76", "UBA"),
    BankOption("54", "Victoria Bank"),
    BankOption("19", "Bank of Africa"),
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WithdrawScreen(onDone: () -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var method by remember { mutableStateOf("mpesa") }
    var amount by remember { mutableStateOf("") }
    var balance by remember { mutableStateOf(0.0) }
    var loading by remember { mutableStateOf(false) }
    var bankOption by remember { mutableStateOf(BANK_OPTIONS[0]) }
    var bankDropdownExpanded by remember { mutableStateOf(false) }
    var destinationAccount by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                balance = apiCall { apiService.walletBalance() }.wallet.balance.toDoubleOrNull() ?: 0.0
            } catch (_: Exception) {
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Bg)
            .verticalScroll(rememberScrollState())
            .padding(20.dp)
    ) {
        ScreenHeader("Withdraw", subtitle = "Choose withdrawal method", onBack = onDone)

        METHODS.forEach { m ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 12.dp)
                    .background(CardColor, RoundedCornerShape(18.dp))
                    .border(1.dp, Border, RoundedCornerShape(18.dp))
                    .clickable { method = m.key }
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier.size(40.dp).background(PrimaryLight, RoundedCornerShape(12.dp)),
                    contentAlignment = Alignment.Center
                ) { Icon(m.icon, contentDescription = null, tint = Primary) }
                Spacer(Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(m.label, fontWeight = FontWeight.Bold, fontSize = 14.5.sp)
                    Text(m.tag, fontSize = 11.5.sp, color = TextMuted)
                }
                if (method == m.key) Icon(Icons.Filled.CheckCircle, contentDescription = null, tint = Primary)
            }
        }

        if (method == "bank") {
            Spacer(Modifier.height(8.dp))
            Text("Send To", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = TextMuted)
            Spacer(Modifier.height(8.dp))
            ExposedDropdownMenuBox(
                expanded = bankDropdownExpanded,
                onExpandedChange = { bankDropdownExpanded = it }
            ) {
                OutlinedTextField(
                    value = bankOption.label,
                    onValueChange = {},
                    readOnly = true,
                    trailingIcon = { Icon(Icons.Filled.ArrowDropDown, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth().menuAnchor()
                )
                ExposedDropdownMenu(expanded = bankDropdownExpanded, onDismissRequest = { bankDropdownExpanded = false }) {
                    BANK_OPTIONS.forEach { option ->
                        DropdownMenuItem(
                            text = { Text(option.label) },
                            onClick = {
                                bankOption = option
                                bankDropdownExpanded = false
                            }
                        )
                    }
                }
            }
            Spacer(Modifier.height(12.dp))
            Text(
                if (bankOption.code == "MPESA") "M-Pesa Phone Number" else "Account Number",
                fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = TextMuted
            )
            Spacer(Modifier.height(8.dp))
            OutlinedTextField(
                value = destinationAccount,
                onValueChange = { destinationAccount = it },
                placeholder = { Text(if (bankOption.code == "MPESA") "0712345678" else "e.g. 1234567890") },
                keyboardOptions = KeyboardOptions(keyboardType = if (bankOption.code == "MPESA") KeyboardType.Phone else KeyboardType.Number),
                modifier = Modifier.fillMaxWidth()
            )
            // Not every bank's account numbers fit — this API caps the
            // destination field at 10 characters, which some banks (Equity,
            // Co-op among them) commonly exceed. Surfacing this upfront
            // avoids a confusing generic rejection after submitting.
            if (bankOption.code != "MPESA" && destinationAccount.length > 10) {
                Spacer(Modifier.height(4.dp))
                Text(
                    "This account number looks too long for this transfer method (max 10 digits) — some banks aren't supported yet.",
                    fontSize = 11.5.sp, color = MaterialTheme.colorScheme.error
                )
            }
        }

        Spacer(Modifier.height(8.dp))
        Text("Enter Amount", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = TextMuted)
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = amount,
            onValueChange = { amount = it.filter { c -> c.isDigit() || c == '.' } },
            placeholder = { Text("0.00") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            leadingIcon = { Text("KES", fontWeight = FontWeight.Bold, color = TextFaint) },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(8.dp))
        Text("Available Balance: ${formatMoney(balance)}", fontSize = 12.5.sp, color = TextMuted)

        Spacer(Modifier.height(20.dp))
        PrimaryButton(
            "Continue",
            loading = loading,
            onClick = {
                val value = amount.toDoubleOrNull()
                if (value == null || value <= 0) {
                    Toast.makeText(context, "Enter a valid amount.", Toast.LENGTH_SHORT).show()
                    return@PrimaryButton
                }
                if (value > balance) {
                    Toast.makeText(context, "That's more than your available balance.", Toast.LENGTH_SHORT).show()
                    return@PrimaryButton
                }
                if (method == "bank" && destinationAccount.isBlank()) {
                    Toast.makeText(
                        context,
                        if (bankOption.code == "MPESA") "Enter a valid M-Pesa phone number." else "Enter a destination account number.",
                        Toast.LENGTH_SHORT
                    ).show()
                    return@PrimaryButton
                }
                loading = true
                scope.launch {
                    try {
                        val body = mutableMapOf("amount" to value.toString(), "channel" to method)
                        if (method == "bank") {
                            body["bank_code"] = bankOption.code
                            body["bank_account"] = destinationAccount
                        }
                        apiCall { apiService.withdraw(body) }
                        Toast.makeText(context, "Withdrawal is being processed.", Toast.LENGTH_LONG).show()
                        onDone()
                    } catch (e: ApiException) {
                        Toast.makeText(context, e.message, Toast.LENGTH_LONG).show()
                    } finally {
                        loading = false
                    }
                }
            }
        )
    }
}
