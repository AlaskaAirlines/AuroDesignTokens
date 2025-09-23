// swift-tools-version: 6.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "auroDesignTokens-sdk-ios",
    defaultLocalization: "en",
    platforms: [.macCatalyst(.v16), .iOS(.v16), .macOS(.v13), .watchOS(.v9), .visionOS(.v1)],
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "auroDesignTokens-sdk-ios",
            targets: ["auroDesignTokens-sdk-ios"]),
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .target(
            name: "auroDesignTokens-sdk-ios",
            swiftSettings: [
                .enableExperimentalFeature("StrictConcurrency")
            ],
            linkerSettings: [
                // Frameworks
                .linkedFramework("SwiftUI")
            ]),
        .testTarget(
            name: "auroDesignTokens-sdk-ios-tests",
            dependencies: ["auroDesignTokens-sdk-ios"],
            swiftSettings: [
                .enableExperimentalFeature("StrictConcurrency")
            ]
        ),
    ],
    swiftLanguageModes: [.v5]
)