plugins {
    alias(libs.plugins.android.library)
    alias(libs.plugins.kotlin.android)
    `maven-publish`
    signing
}

// Read package.json and extract the version
val packageJsonVersion: String by lazy {
    val file = file("../../../package.json") // Adjust path if needed
    val json = groovy.json.JsonSlurper().parse(file) as Map<*, *>
    json["version"].toString()
}

android {
    namespace = "com.alaskaair.aurodesigntokens_sdk_android"
    compileSdk = 35

    defaultConfig {
        minSdk = 26

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles("consumer-rules.pro")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    lint {
        warningsAsErrors = true
    }
}

dependencies {
    testImplementation(kotlin("test"))
    implementation(libs.androidx.ui.graphics.android)
}

publishing {
    publications {
        register<MavenPublication>("release") {
            groupId = "com.alaskaair"
            artifactId = "aurodesigntokens-sdk-android"
            version = packageJsonVersion
            afterEvaluate {
                from(components["release"])
            }
            pom {
                name = "Auro Design Tokens SDK for Android"
                description =
                    "Contains a Kotlin SDK Package containing primitive Auro Design Tokens."
                url = "https://github.com/AlaskaAirlines/AuroDesignTokens"

                licenses {
                    license {
                        name.set("The Apache License, Version 2.0")
                        url.set("http://www.apache.org/licenses/LICENSE-2.0.txt")
                    }
                }
            }
        }
    }

    repositories {
        maven {
            name = "OSSRH"
            url = uri("https://oss.sonatype.org/service/local/staging/deploy/maven2/")
            credentials {
                username = System.getenv("OSSRH_USERNAME")
                password = System.getenv("OSSRH_PASSWORD")
            }
        }
    }
}

signing {
    sign(publishing.publications["release"])
}
