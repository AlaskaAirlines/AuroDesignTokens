import SwiftUI

extension Color {
    init(hex: UInt32) {
        let components = (
            R: Double((hex >> 16) & 0xff) / 255,
            G: Double((hex >> 8) & 0xff) / 255,
            B: Double(hex & 0xff) / 255,
            A: Double((hex >> 24) & 0xff) / 255
        )
        self.init(.sRGB, red: components.R, green: components.G, blue: components.B, opacity: components.A)
    }
}
