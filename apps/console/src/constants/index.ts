import cargo from '@/assets/ecosystem/cargo.svg';
import cocoapods from '@/assets/ecosystem/cocoapods.svg';
import composer from '@/assets/ecosystem/composer.svg';
import cran from '@/assets/ecosystem/cran.svg';
import go from '@/assets/ecosystem/go.svg';
import maven from '@/assets/ecosystem/maven.svg';
import npm from '@/assets/ecosystem/npm.svg';
import nuget from '@/assets/ecosystem/nuget.svg';
import pip from '@/assets/ecosystem/pypi.svg';
import rubygems from '@/assets/ecosystem/rubygems.svg';
import swift from '@/assets/ecosystem/swift.svg';
import hex from '@/assets/ecosystem/hex.svg';
import pub from '@/assets/ecosystem/pub.svg';
import conan from '@/assets/ecosystem/conan.svg';
import linux from '@/assets/ecosystem/linux.svg';

const { origin } = window.location;

export default origin;

export const ecosystem:any = {
    cargo: {
        name: 'Cargo',
        description: 'Cargo 是 Rust 编程语言的官方包管理器和构建系统。它为开发者提供了管理项目依赖、编译代码、运行测试、生成文档等功能。在 Cargo 生态中，开发者可以通过 Crates.io（Rust 官方库平台）下载并共享各种开源组件，使项目的模块化开发更为便捷。',
        img: cargo,
    },
    cocoapods: {
        name: 'CocoaPods',
        description: 'CocoaPods 是为 Objective-C 和 Swift 项目提供的依赖管理系统。它帮助开发者快速集成常用的第三方库，简化了 iOS 和 macOS 项目的开发流程。CocoaPods 生态包含了大量优秀的开源库，如 Alamofire、AFNetworking 等，提高了苹果生态应用开发的效率。',
        img: cocoapods,
    },
    composer: {
        name: 'Composer',
        description: 'Composer 是 PHP 语言的包管理和依赖管理工具。它主要用于管理项目中的第三方库，通过丰富的生态系统提供了诸如 Laravel、Symfony 等框架和工具。Composer 生态中有数十万开源组件，大大提升了 PHP 项目的开发效率和协作能力。',
        img: composer,
    },
    cran: {
        name: 'CRAN',
        description: 'CRAN（The Comprehensive R Archive Network）是 R 语言的官方包管理和分发平台。CRAN 提供了大量用于统计分析、数据可视化和机器学习的开源包，如 ggplot2、dplyr、caret 等，推动了 R 语言在数据科学领域的广泛使用。',
        img: cran,
    },
    go: {
        name: 'Go',
        description: 'Go 生态使用 Go Modules 作为默认的依赖管理工具。在 Go 语言开发中，Go Modules 提供了灵活的依赖管理和版本控制功能。Go 生态系统拥有丰富的库和框架，包括 Gin、Echo 等常用 Web 框架，以及 gRPC、k8s 相关的开源工具。',
        img: go,
    },
    maven: {
        name: 'Maven',
        description: 'Maven 是 Java 生态中最流行的构建和依赖管理工具，同时也被 Kotlin、Scala 等 JVM 语言广泛使用。Maven 生态系统拥有大量的开源库和插件，支持企业级开发和持续集成，如 Spring 框架、Hibernate 等，使其成为 Java 项目的标准化工具。',
        img: maven,
    },
    npm: {
        name: 'NPM',
        description: 'NPM 是 JavaScript 和 TypeScript 语言的包管理器，构成了 Node.js 开发的重要部分。NPM 生态系统中包括了前端框架（如 React、Vue.js）、工具链（如 Webpack、ESLint）和后端框架（如 Express）。',
        img: npm,
    },
    nuget: {
        name: 'NuGet',
        description: 'NuGet 是 .NET 平台的包管理器，支持 C#、F# 和 VB.NET 等语言。NuGet 生态提供了大量的开源库和工具，包括 ASP.NET Core、Entity Framework 等，帮助开发者快速构建现代化 Web 应用、桌面应用和云服务项目。',
        img: nuget,
    },
    pypi: {
        name: 'PyPI',
        description: 'PyPI 是 Python 语言的官方包管理和发布平台，支持通过 pip 安装和更新开源库。PyPI 生态系统中有超过数十万个 Python 包，涵盖了 Web 开发、数据科学、机器学习、网络爬虫等领域，常用包如 Django、Flask、scikit-learn、pandas 等。',
        img: pip,
    },
    rubygems: {
        name: 'RubyGems',
        description: 'RubyGems 是 Ruby 语言的官方包管理器和分发平台。RubyGems 生态提供了大量开源库和工具，包括 Rails 框架、Sinatra、Devise 等，使 Ruby 应用开发更加高效便捷。',
        img: rubygems,
    },
    swift: {
        name: 'Swift',
        description: 'SPM 是 Swift 语言官方提供的包管理工具，用于管理依赖库和模块化开发。在 Swift 生态中，SPM 简化了 iOS 和 macOS 应用的依赖引入流程，与 CocoaPods 和 Carthage 共同构成了 Swift 项目的主要包管理方式。',
        img: swift,
    },
    hex: {
        name: 'Hex',
        description: 'Hex 是 Elixir 和 Erlang 语言的包管理和发布平台。Hex 生态提供了大量用于构建高并发分布式系统的库和工具，如 Phoenix 框架等，帮助开发者快速搭建高效的 Web 应用和后端系统。',
        img: hex,
    },
    pub: {
        name: 'Pub',
        description: 'Pub 是 Dart 语言的包管理工具，特别在 Flutter 框架开发中不可或缺。Pub 生态系统包含了丰富的开源库，如用于 UI 开发的 provider、dio 等工具，帮助开发者快速构建跨平台的移动、Web 和桌面应用。',
        img: pub,
    },
    conan: {
        name: 'Conan',
        description: 'Conan 是专为 C/C++ 项目设计的跨平台包管理器和编译器，帮助开发者管理依赖库，特别在需要多个版本的依赖时非常方便。Conan 生态系统支持多种操作系统和编译工具链，例如 GCC、Clang 和 Visual Studio，覆盖从 Windows 到 Linux 再到 macOS 的开发环境。Conan 还通过广泛的开源组件库和强大的社区支持，为开发者提供了丰富的工具和资源，用于管理复杂的 C/C++ 项目依赖关系。',
        img: conan,
    },
    linux: {
        name: 'Generic',
        description: 'Generic 用于管理无法归入特定生态系统的通用软件包，例如直接从源码仓库（如 Git、Mercurial 等版本控制系统）克隆的原始代码，而非通过官方包管理器（如 npm、pip 等）分发的标准化包。',
        img: linux,
    },
    // generic: {
    //     name: 'Generic',
    //     description: 'Generic 用于管理无法归入特定生态系统的通用软件包，例如直接从源码仓库（如 Git、Mercurial 等版本控制系统）克隆的原始代码，而非通过官方包管理器（如 npm、pip 等）分发的标准化包。',
    //     img: linux,
    // },
};

export const SuggestLevel:any = {
    strong_recommend: '强烈建议修复',
    recommend: '建议修复',
    optional: '可选修复',
};

export const RiskLevel = {
    Critical: {
        text: '严重',
        color: '#F34D3D',
    },
    High: {
        text: '高危',
        color: '#FF9940',
    },
    Medium: { text: '中危', color: '#FFCC33' },
    Low: { text: '低危', color: '#D9D9D9' },
};

export const scoreToLevel = (rank: any) => {
    if (rank > 0 && rank < 4) {
        return 'Low';
    } if (rank >= 4 && rank < 7) {
        return 'Medium';
    } if (rank >= 7 && rank < 9) {
        return 'High';
    } if (rank >= 9) {
        return 'Critical';
    }
    return 'Low';
};

export const showColor = (rank:any) => {
    let { color } = RiskLevel.Low;

    if (rank > 0 && rank < 4) {
        color = RiskLevel.Low.color;
    } else if (rank >= 4 && rank < 7) {
        color = RiskLevel.Medium.color;
    } else if (rank >= 7 && rank < 9) {
        color = RiskLevel.High.color;
    } else if (rank >= 9) {
        color = RiskLevel.Critical.color;
    } else {
        color = RiskLevel.Low.color;
    }

    return color;
};

export const CvssSplit = (cvssVector:string) => {
    const items = cvssVector.split('/');
    return items.map((item:any) => {
        const [key, value] = item.split(':');
        return { title: key, val: value };
    });
};

export const CVSS_AV = {
    N: '网络',
    A: '相邻网络',
    L: '本地网络网络',
    P: '物理访问',
};

export const CVSS_AC = {
    L: '低',
    H: '高',
};

export const CVSS_PR = {
    N: '无',
    L: '低',
    H: '高',
};

export const CVSS_UI = {
    N: '无',
    R: '需要',
};

export const CVSS_S = {
    U: '无改变',
    C: '改变',
};

export const CVSS_C = {
    N: '无',
    L: '低',
    H: '高',
};

export const CVSS_I = {
    N: '无',
    L: '低',
    H: '高',
};

export const CVSS_A = {
    N: '无',
    L: '低',
    H: '高',
};

export const CVSS_DESC: Record<string, any> = {
    AV: { title: '攻击向量（AV）', values: CVSS_AV },
    AC: { title: '攻击复杂性（AC）', values: CVSS_AC },
    PR: { title: '权限要求（PR）', values: CVSS_PR },
    UI: { title: '用户交互（UI）', values: CVSS_UI },
    S: { title: '范围（S）', values: CVSS_S },
    C: { title: '漏洞机密性（C）', values: CVSS_C },
    I: { title: '漏洞完整性（I）', values: CVSS_I },
    A: { title: '漏洞可用性（A）', values: CVSS_A },
};

export const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5dDsd4bF6p3UIHnI53Qu
6l8OlCEbCeJI4wAD/cRucSYgUoeSHkGrtwr4C7BKmkc+YJQv+GG9ChUAuNn87NvQ
bBL017FcG/1KQonbGyR+Q2rTxqU4/QVR2xJZl0geNH/2o1UeQ83m/y5HkhMfD6aP
4LPTnaVSkjA36d+Gah2rKG8FfaqeTRZtHoGkSWdj+1k+o4Z4NfaRUOVoa8hWSWkC
J1Yj9+setHtGnY0VnaIGqYGu22eW8bnjK5mCPgaymWYjaMYuSRXwwbcKOQ8X5GQf
0r10uFjMl7GJ93R8ziQuGByHn3BDEWg4CbGAqJjykFDbZtMjaZ/oSJ/wQyKrQqUt
BQIDAQAB
-----END PUBLIC KEY-----`;
