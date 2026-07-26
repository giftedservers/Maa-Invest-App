package co.ke.maawebhost.invest.data.api

import co.ke.maawebhost.invest.data.TokenStore
import co.ke.maawebhost.invest.data.api.dto.ApiErrorBody
import kotlinx.serialization.json.Json
import okhttp3.Interceptor
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Response
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.HttpException
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory

/** Point this at your deployed MAA INVEST backend. */
const val API_BASE_URL = "https://invest.maawebhost.co.ke/api/"

class ApiException(message: String, val status: Int, val upgradeRequired: Boolean = false) : Exception(message)

private val json = Json { ignoreUnknownKeys = true; explicitNulls = false }

private val authInterceptor = Interceptor { chain ->
    val builder = chain.request().newBuilder()
    TokenStore.getToken()?.let { builder.addHeader("Authorization", "Bearer $it") }
    chain.proceed(builder.build())
}

private val okHttpClient = OkHttpClient.Builder()
    .addInterceptor(authInterceptor)
    .addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC })
    .build()

val apiService: ApiService by lazy {
    Retrofit.Builder()
        .baseUrl(API_BASE_URL)
        .client(okHttpClient)
        .addConverterFactory(json.asConverterFactory("application/json".toMediaType()))
        .build()
        .create(ApiService::class.java)
}

/** Wraps a suspend Retrofit call and converts HTTP error bodies into ApiException with the backend's message. */
suspend fun <T> apiCall(block: suspend () -> T): T {
    return try {
        block()
    } catch (e: HttpException) {
        val errorBody = e.response()?.errorBody()?.string()
        val parsed = try {
            errorBody?.let { json.decodeFromString(ApiErrorBody.serializer(), it) }
        } catch (_: Exception) {
            null
        }
        throw ApiException(
            parsed?.message ?: "Something went wrong. Please try again.",
            e.code(),
            parsed?.upgrade_required ?: false
        )
    } catch (e: java.io.IOException) {
        throw ApiException("Could not reach the server. Check your connection.", 0)
    }
}
