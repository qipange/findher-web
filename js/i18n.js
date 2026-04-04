// 语言配置文件
const translations = {
    'zh-CN': {
        // 首页文本
        'title': 'FindHer - 位置共享',
        'subtitle': '与同伴共享位置，不再走散',
        'friendLocation': '朋友位置',
        'pasteBtn': '粘贴',
        'setTargetBtn': '设为目标',
        'myLocation': '我的位置',
        'copyMyLocationBtn': '复制我的位置',
        'startNavigationBtn': '去找他',
        'disclaimer': '位置信息仅用于导航，不会上传服务器',
        'privacyPolicy': '隐私政策',
        'userAgreement': '用户协议',
        'feedback': '意见反馈',
        
        // 导航页文本
        'navigationTitle': '导航',
        'distance': '米',
        'altitude': '高度',
        'altitudeUnit': '米',
        'altitudeUnknown': '未知 米',
        'speed': '速度',
        'speedUnit': 'm/s',
        'accuracy': '精度',
        'accuracyUnit': '米',
        'friendLocationNav': '朋友位置',
        'myLocationNav': '我的位置',
        'mapViewBtn': '地图视图',
        'returnBtn': '返回首页',
        
        // 错误信息
        'browserNotSupported': '您的浏览器不支持地理位置服务',
        'locationPermissionDenied': '用户拒绝了位置请求',
        'locationUnavailable': '位置信息不可用',
        'locationTimeout': '获取位置请求超时',
        'locationUnknownError': '发生未知错误',
        'clipboardAccessDenied': '无法访问剪贴板，请手动粘贴',
        'enterFriendLocation': '请输入朋友的位置信息',
        'targetLocationSet': '已设置目标位置',
        'invalidLocationFormat': '无法解析位置信息，请确保格式正确（度分秒格式）',
        'locationNotAvailable': '位置信息尚未获取，请稍候',
        'locationCopied': '位置信息已复制到剪贴板',
        'copyFailed': '复制失败，请手动复制',
        'myLocationNotAvailable': '您的位置信息尚未获取，请稍候',
        'friendLocationNotSet': '请先设置朋友的位置'
    },
    'en-US': {
        // Home page text
        'title': 'FindHer - Location Sharing',
        'subtitle': 'Share location with companions, never get lost',
        'friendLocation': 'Friend\'s Location',
        'pasteBtn': 'Paste',
        'setTargetBtn': 'Set Target',
        'myLocation': 'My Location',
        'copyMyLocationBtn': 'Copy My Location',
        'startNavigationBtn': 'Find Them',
        'disclaimer': 'Location info is only used for navigation, not uploaded to server',
        'privacyPolicy': 'Privacy Policy',
        'userAgreement': 'User Agreement',
        'feedback': 'Feedback',
        
        // Navigation page text
        'navigationTitle': 'Navigation',
        'distance': 'meters',
        'altitude': 'Altitude',
        'altitudeUnit': 'm',
        'altitudeUnknown': 'Unknown m',
        'speed': 'Speed',
        'speedUnit': 'm/s',
        'accuracy': 'Accuracy',
        'accuracyUnit': 'm',
        'friendLocationNav': 'Friend\'s Location',
        'myLocationNav': 'My Location',
        'mapViewBtn': 'Map View',
        'returnBtn': 'Return Home',
        
        // Error messages
        'browserNotSupported': 'Your browser does not support geolocation services',
        'locationPermissionDenied': 'User denied location request',
        'locationUnavailable': 'Location information unavailable',
        'locationTimeout': 'Location request timed out',
        'locationUnknownError': 'An unknown error occurred',
        'clipboardAccessDenied': 'Cannot access clipboard, please paste manually',
        'enterFriendLocation': 'Please enter your friend\'s location',
        'targetLocationSet': 'Target location set',
        'invalidLocationFormat': 'Cannot parse location information, please ensure correct format (DMS format)',
        'locationNotAvailable': 'Location information not yet available, please wait',
        'locationCopied': 'Location information copied to clipboard',
        'copyFailed': 'Copy failed, please copy manually',
        'myLocationNotAvailable': 'Your location information is not yet available, please wait',
        'friendLocationNotSet': 'Please set your friend\'s location first'
    }
};

// 获取用户浏览器语言
function getUserLanguage() {
    // 获取浏览器语言设置
    const browserLang = navigator.language || navigator.userLanguage;
    
    // 检查是否支持该语言，如果不支持则默认使用中文
    if (browserLang.startsWith('zh')) {
        return 'zh-CN';
    } else if (translations[browserLang]) {
        return browserLang;
    } else if (browserLang.startsWith('en')) {
        return 'en-US';
    } else {
        // 默认使用中文
        return 'zh-CN';
    }
}

// 当前语言
const currentLang = getUserLanguage();

// 翻译函数
function t(key) {
    if (translations[currentLang] && translations[currentLang][key]) {
        return translations[currentLang][key];
    }
    // 如果找不到翻译，返回中文版本或键名
    return translations['zh-CN'][key] || key;
}

// 导出翻译函数和当前语言
export { t, currentLang };