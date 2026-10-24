package com.battlefrogs.game;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Mantener pantalla encendida para jugar cómodamente
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // Crear WebView y establecerlo como vista principal ANTES de manipular decorView
        webView = new WebView(this);
        setContentView(webView);

        // Configuración de WebView para máximo rendimiento de juego HTML5 Canvas
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);

        // Habilitar aceleración por hardware
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setBackgroundColor(0xFF051C14);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        // Cargar el juego desde la carpeta de assets
        webView.loadUrl("file:///android_asset/index.html");

        // Ocultar barras del sistema después de que la vista esté montada
        hideSystemUI();
        if (webView != null) {
            webView.post(this::hideSystemUI);
        }
    }

    private void hideSystemUI() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                View decorView = getWindow().getDecorView();
                if (decorView != null) {
                    WindowInsetsController controller = decorView.getWindowInsetsController();
                    if (controller != null) {
                        controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                        controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                    }
                }
            } else {
                View decorView = getWindow().getDecorView();
                if (decorView != null) {
                    decorView.setSystemUiVisibility(
                            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    );
                }
            }
        } catch (Throwable ignored) {
            // Prevenir cualquier crash específico de capas de personalización (MIUI/HyperOS, etc.)
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
            webView.resumeTimers();
        }
        hideSystemUI();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) {
            webView.onPause();
            webView.pauseTimers();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
