import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?
  var bridge: CAPBridgeProtocol?

  // helper para apanhar a bridge assim que a window/VC existir
  private func captureBridgeIfNeeded(_ origin: String) {
    if let rootVC = self.window?.rootViewController as? CAPBridgeViewController {
      if self.bridge == nil {
        self.bridge = rootVC.bridge
        print("✅ AppDelegate: bridge obtida (\(origin))")
      } else {
        print("ℹ️ AppDelegate: bridge já definida (\(origin))")
      }
    } else {
      print("⚠️ AppDelegate: rootViewController ainda não é CAPBridgeViewController (\(origin))")
    }
  }

  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    // tenta já
    captureBridgeIfNeeded("didFinishLaunching/immediate")

    // tenta logo a seguir ao 1º ciclo de runloop (quando a window costuma estar pronta)
    DispatchQueue.main.async { [weak self] in
      self?.captureBridgeIfNeeded("didFinishLaunching/async")
    }

    // (opcional) mais uma tentativa 0.5s depois
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
      self?.captureBridgeIfNeeded("didFinishLaunching/+0.5s")
    }

    // 📸 Screenshot tirado
    NotificationCenter.default.addObserver(
      forName: UIApplication.userDidTakeScreenshotNotification,
      object: nil, queue: .main
    ) { [weak self] _ in
      print("📸 AppDelegate: screenshotTaken")
      // 1) tenta via API do Capacitor
      self?.bridge?.triggerJSEvent(eventName: "screenshotTaken", target: "window")
      // 2) fallback garantido: injeta JS directo no WebView
      self?.bridge?.webView?.evaluateJavaScript("window.__onCapEvent && window.__onCapEvent('screenshotTaken');")
    }

    // 🎥 Screen recording / AirPlay ligado/desligado
    NotificationCenter.default.addObserver(
      forName: UIScreen.capturedDidChangeNotification,
      object: nil, queue: .main
    ) { [weak self] _ in
      let captured = UIScreen.main.isCaptured
      let evt = captured ? "screenCapturedStart" : "screenCapturedEnd"
      print("🎥 AppDelegate: \(evt)")
      self?.bridge?.triggerJSEvent(eventName: evt, target: "window")
      self?.bridge?.webView?.evaluateJavaScript("window.__onCapEvent && window.__onCapEvent('\(evt)');")
    }

    // (teste de fumo) 2s após abrir, envia um evento para o JS
    DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self] in
      self?.bridge?.webView?.evaluateJavaScript("window.__onCapEvent && window.__onCapEvent('helloFromNative');")
    }

    return true
  }

  // quando a app passa a active, a window já está definitivamente no síti
    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
