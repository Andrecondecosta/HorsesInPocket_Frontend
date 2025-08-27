import Foundation
import Capacitor

@objc(ScreenshotDetectorPlugin)
public class ScreenshotDetectorPlugin: CAPPlugin {
    public override func load() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(screenshotTaken),
            name: UIApplication.userDidTakeScreenshotNotification,
            object: nil
        )
    }

    @objc func screenshotTaken() {
        notifyListeners("screenshotTaken", data: [:])
    }
}
