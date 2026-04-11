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
        'copyMyLocationBtnFull': '复制我的位置发给同伴',
        'startNavigationBtn': '去找他',
        'disclaimer': '位置信息仅用于导航，不会上传服务器',
        'privacyPolicy': '隐私政策',
        'userAgreement': '用户协议',
        'feedback': '意见反馈',
        'sponsorLink': '支持我们',
        
        // 首页使用方法
        'usageTitle': '使用方法',
        'usageCase1Title': '想让同伴找你',
        'usageCase1Desc': '点击"复制我的位置发给同伴"，然后通过通讯工具发给同伴，他点击链接进入导航页面去找你，前进方向尽量与连线方向一致。',
        'usageCase2Title': '你想去找同伴',
        'usageCase2Desc': '请他按照第一种情况操作，发链接给你，你点击链接进入导航页面去找他，前进方向尽量与连线方向一致。',
        'gettingLocation': '正在获取位置...',
        'adLabel': '广告',
        
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
        'accuracyWarning': '定位精度较低',
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
        'friendLocationNotSet': '请先设置朋友的位置',
        
        // 打赏弹窗
        'tipTitle': '🎉 成功汇合！',
        'tipMessage': 'FindHer 帮你找到了同伴，如果觉得有用，请支持我们继续维护~',
        'tipUsageCount': '次成功汇合',
        'tipCloseBtn': '别烦我',
        'tipNeverBtn': '不再提示',
        
        // 赞助页
        'sponsorTitle': '☕ 支持 FindHer',
        'sponsorDesc': 'FindHer 是一款免费的位置共享工具，帮助走散的朋友快速汇合。如果它帮到了你，欢迎请作者喝杯咖啡，支持我们继续维护和改进~',
        'sponsorUsageCount': '次成功汇合',
        'sponsorFree': '免费',
        'sponsorFreeLabel': '完全免费使用',
        'sponsorNoAds': '无广告',
        'sponsorNoAdsLabel': '导航页无广告',
        'sponsorAmount': '支持金额',
        'sponsorAmountPlaceholder': '输入金额',
        'sponsorAmountHint': '随心意，感谢支持',
        'sponsorCNY': '¥ 人民币',
        'sponsorUSD': '$ 美元',
        'sponsorPaymentMethod': '选择支付方式',
        'sponsorWechatPay': '微信支付',
        'sponsorThanks': '感谢你的支持！',
        'sponsorThanksDesc': '每一份支持都是我们继续前进的动力。FindHer 会一直保持免费、简洁、好用。',
        'sponsorShare': '分享给朋友',
        'sponsorBackBtn': '← 返回首页',
        'sponsorAdLabel': '广告'
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
        'copyMyLocationBtnFull': 'Copy My Location to Share',
        'startNavigationBtn': 'Find Them',
        'disclaimer': 'Location info is only used for navigation, not uploaded to server',
        'privacyPolicy': 'Privacy Policy',
        'userAgreement': 'User Agreement',
        'feedback': 'Feedback',
        'sponsorLink': 'Support Us',
        
        // Home page usage
        'usageTitle': 'How to Use',
        'usageCase1Title': 'Want your friend to find you',
        'usageCase1Desc': 'Click "Copy My Location to Share", then send the link to your friend via messaging app. They can open the navigation page to find you. Keep your direction aligned with the line.',
        'usageCase2Title': 'You want to find your friend',
        'usageCase2Desc': 'Ask them to follow the first method and send you the link. Open the navigation page to find them. Keep your direction aligned with the line.',
        'gettingLocation': 'Getting location...',
        'adLabel': 'Ad',
        
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
        'accuracyWarning': 'Low location accuracy',
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
        'friendLocationNotSet': 'Please set your friend\'s location first',
        
        // Tip modal
        'tipTitle': '🎉 Successfully Met Up!',
        'tipMessage': 'FindHer helped you find your companion. If you find it useful, please support us~',
        'tipUsageCount': 'successful meetups',
        'tipCloseBtn': 'Leave me alone',
        'tipNeverBtn': 'Don\'t show again',
        
        // Sponsor page
        'sponsorTitle': '☕ Support FindHer',
        'sponsorDesc': 'FindHer is a free location sharing tool that helps friends find each other when separated. If it helped you, consider buying the author a coffee to support continued development~',
        'sponsorUsageCount': 'successful meetups',
        'sponsorFree': 'Free',
        'sponsorFreeLabel': 'Completely free to use',
        'sponsorNoAds': 'No Ads',
        'sponsorNoAdsLabel': 'No ads on navigation page',
        'sponsorAmount': 'Support Amount',
        'sponsorAmountPlaceholder': 'Enter amount',
        'sponsorAmountHint': 'Any amount, thank you!',
        'sponsorCNY': '¥ CNY',
        'sponsorUSD': '$ USD',
        'sponsorPaymentMethod': 'Select Payment Method',
        'sponsorWechatPay': 'WeChat Pay',
        'sponsorThanks': 'Thank you for your support!',
        'sponsorThanksDesc': 'Every contribution motivates us to keep going. FindHer will always remain free, simple, and useful.',
        'sponsorShare': 'Share with friends',
        'sponsorBackBtn': '← Back to Home',
        'sponsorAdLabel': 'Ad'
    }
};

// 获取用户浏览器语言
function getUserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    
    if (browserLang.startsWith('zh')) {
        return 'zh-CN';
    } else if (translations[browserLang]) {
        return browserLang;
    } else if (browserLang.startsWith('en')) {
        return 'en-US';
    } else {
        return 'en-US';
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