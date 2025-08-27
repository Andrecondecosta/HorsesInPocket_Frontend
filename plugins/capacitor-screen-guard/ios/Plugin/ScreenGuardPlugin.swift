import Foundation
import Capacitor

@objc(ScreenGuardPlugin)
public class ScreenGuardPlugin: CAPPlugin {

  private var hasListeners = false

  override public func load() {
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(screenshotTaken),
      name: UIApplication.userDidTakeScreenshotNotification,
      object: nil
    )

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(screenCaptureChanged),
      name: UIScreen.capturedDidChangeNotification,
      object: nil
    )
  }

  @objc private func screenshotTaken() {
    if hasListeners {
      notifyListeners("screenshotTaken", data: [:])
    }
  }

  @objc private func screenCaptureChanged() {
    let isCaptured = UIScreen.main.isCaptured
    let event = isCaptured ? "screenCapturedStart" : "screenCapturedEnd"
    if hasListeners {
      notifyListeners(event, data: [:])
    }
  }
}
