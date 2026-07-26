package co.ke.maawebhost.invest.data.api

import co.ke.maawebhost.invest.data.api.dto.*
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface ApiService {

    @POST("auth/register.php")
    suspend fun register(@Body body: Map<String, String>): AuthResponse

    @POST("auth/login.php")
    suspend fun login(@Body body: Map<String, String>): AuthResponse

    @GET("auth/me.php")
    suspend fun me(): MeResponse

    @POST("auth/logout.php")
    suspend fun logout(): Map<String, Boolean>

    @GET("dashboard.php")
    suspend fun dashboard(): DashboardResponse

    @GET("goals/list.php")
    suspend fun listGoals(): GoalListResponse

    @POST("goals/create.php")
    suspend fun createGoal(@Body body: Map<String, String>): GoalResponse

    @POST("goals/fund.php")
    suspend fun fundGoal(@Body body: Map<String, String>): GoalResponse

    @GET("wallet/balance.php")
    suspend fun walletBalance(): WalletBalanceResponse

    @GET("wallet/transactions.php")
    suspend fun walletTransactions(@Query("page") page: Int): TransactionListResponse

    @POST("wallet/deposit.php")
    suspend fun deposit(@Body body: Map<String, String>): WalletActionResponse

    @POST("wallet/withdraw.php")
    suspend fun withdraw(@Body body: Map<String, String>): WalletActionResponse

    @GET("investments/products.php")
    suspend fun listProducts(): ProductsResponse

    @GET("investments/holdings.php")
    suspend fun listHoldings(): HoldingsResponse

    @POST("investments/buy.php")
    suspend fun buyInvestment(@Body body: Map<String, String>): WalletActionResponse

    @GET("groups/list.php")
    suspend fun listGroups(): GroupListResponse

    @POST("groups/join.php")
    suspend fun joinGroup(@Body body: Map<String, String>): GroupResponse

    @POST("groups/contribute.php")
    suspend fun contributeToGroup(@Body body: Map<String, String>): ContributeResponse
}
