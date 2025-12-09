package com.simplycrm.mobileappnew

import android.content.Context
import com.facebook.flipper.android.AndroidFlipperClient
import com.facebook.flipper.android.utils.FlipperUtils
import com.facebook.flipper.plugins.inspector.DescriptorMapping
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin
import com.facebook.flipper.plugins.network.FlipperOkhttpInterceptor
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin
import com.facebook.react.ReactInstanceManager
import com.facebook.react.modules.network.NetworkingModule
import okhttp3.OkHttpClient

/**
 * Debug-only Flipper setup that wires OkHttp to the Network plugin so requests
 * show up in Flipper's Network tab.
 */
object ReactNativeFlipper {
  fun initializeFlipper(context: Context, _reactInstanceManager: ReactInstanceManager) {
    if (!FlipperUtils.shouldEnableFlipper(context)) return

    val client = AndroidFlipperClient.getInstance(context)

    // Ensure a single shared network plugin instance so the interceptor can reuse it.
    val networkPlugin =
      MainApplication.networkFlipperPlugin ?: NetworkFlipperPlugin().also {
        MainApplication.networkFlipperPlugin = it
      }

    client.addPlugin(InspectorFlipperPlugin(context, DescriptorMapping.withDefaults()))
    client.addPlugin(networkPlugin)
    client.start()

    // Hook Flipper into React Native's networking stack (fetch/axios).
    NetworkingModule.setCustomClientBuilder { builder: OkHttpClient.Builder ->
      builder.addNetworkInterceptor(FlipperOkhttpInterceptor(networkPlugin))
    }
  }
}


