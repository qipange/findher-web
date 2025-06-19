// 导入翻译函数
import { t, currentLang } from './i18n.js';

// 全局变量
let myLatitude = null;
let myLongitude = null;
let watchId = null;
let compassHeading = 0;

// 位置平滑处理相关变量
let positionHistory = [];
const MAX_POSITION_HISTORY = 5; // 保存最近5个位置点
let lastAccuracy = 0; // 最后一次位置精度

// DOM 元素
const myLocationDisplay = document.getElementById('myLocation');
const copyMyLocationBtn = document.getElementById('copyMyLocationBtn');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 应用语言翻译
    applyTranslations();
    
    // 检查URL参数，看是否是通过链接进入的
    checkLocationFromURL();
    
    // 获取我的位置
    startLocationTracking();
    
    // 事件监听器
    copyMyLocationBtn.addEventListener('click', copyMyLocationWithLink);
});

// 应用翻译到页面元素
function applyTranslations() {
    // 设置页面标题
    document.getElementById('page-title').textContent = t('title');
    
    // 设置页面文本
    document.getElementById('subtitle').textContent = t('subtitle');
    document.getElementById('my-location-title').textContent = t('myLocation');
    document.getElementById('disclaimer').textContent = t('disclaimer');
    document.getElementById('privacy-link').textContent = t('privacyPolicy');
    document.getElementById('agreement-link').textContent = t('userAgreement');
    document.getElementById('feedback-link').textContent = t('feedback');
    
    // 设置按钮文本
    copyMyLocationBtn.textContent = '复制我的位置发给同伴';
}

// 检查URL参数中的位置信息
function checkLocationFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');
    
    if (lat && lng) {
        // 如果URL中包含位置信息，直接跳转到导航页
        sessionStorage.setItem('friendLatitude', lat);
        sessionStorage.setItem('friendLongitude', lng);
        
        // 等待获取自己的位置后再跳转
        const checkMyLocation = setInterval(() => {
            if (myLatitude && myLongitude) {
                sessionStorage.setItem('myLatitude', myLatitude);
                sessionStorage.setItem('myLongitude', myLongitude);
                window.location.href = 'navigation.html';
                clearInterval(checkMyLocation);
            }
        }, 500);
        
        // 5秒后如果还没获取到位置就强制跳转
        setTimeout(() => {
            clearInterval(checkMyLocation);
            if (!myLatitude || !myLongitude) {
                alert('正在获取您的位置，请稍候...');
                window.location.href = 'navigation.html';
            }
        }, 5000);
    }
}

// 开始位置追踪
function startLocationTracking() {
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
            updateMyLocation,
            handleLocationError,
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
        
        // 监听设备方向
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
        }
    } else {
        alert(t('browserNotSupported'));
    }
}

// 更新我的位置
function updateMyLocation(position) {
    // 记录位置精度
    lastAccuracy = position.coords.accuracy;
    
    // 添加新位置到历史记录
    positionHistory.push({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
    });
    
    // 保持历史记录在指定长度内
    if (positionHistory.length > MAX_POSITION_HISTORY) {
        positionHistory.shift();
    }
    
    // 应用位置平滑算法
    const smoothedPosition = smoothPosition(positionHistory);
    myLatitude = smoothedPosition.latitude;
    myLongitude = smoothedPosition.longitude;
    
    // 转换为度分秒格式并显示
    const formattedLocation = formatToDMS(myLatitude, myLongitude);
    // 添加精度信息
    const accuracyInfo = `(精度: ${Math.round(lastAccuracy)}米)`;
    myLocationDisplay.textContent = `${formattedLocation} ${accuracyInfo}`;
}

// 处理位置错误
function handleLocationError(error) {
    let errorMessage;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = t('locationPermissionDenied');
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = t('locationUnavailable');
            break;
        case error.TIMEOUT:
            errorMessage = t('locationTimeout');
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = t('locationUnknownError');
            break;
    }
    myLocationDisplay.textContent = `${t('locationUnknownError')}: ${errorMessage}`;
}

// 处理设备方向
function handleOrientation(event) {
    if (event.webkitCompassHeading) {
        // iOS设备
        compassHeading = event.webkitCompassHeading;
    } else if (event.alpha) {
        // Android设备
        compassHeading = 360 - event.alpha;
    }
}

// 复制我的位置并生成链接
async function copyMyLocationWithLink() {
    if (!myLatitude || !myLongitude) {
        alert(t('locationNotAvailable'));
        return;
    }
    
    // 生成包含位置信息的链接
    const currentPath = window.location.pathname;
    let baseUrl;
    
    if (currentPath.endsWith('index-v2.html')) {
        // 如果当前在index-v2.html页面
        baseUrl = window.location.origin + currentPath.replace('index-v2.html', '');
    } else if (currentPath.endsWith('/')) {
        // 如果当前在根目录
        baseUrl = window.location.origin + currentPath;
    } else {
        // 其他情况，确保以/结尾
        baseUrl = window.location.origin + currentPath + '/';
    }
    
    const locationLink = `${baseUrl}index-v2.html?lat=${myLatitude}&lng=${myLongitude}`;
    
    try {
        await navigator.clipboard.writeText(locationLink);
        alert('位置链接已复制到剪贴板！\n\n发送给同伴，他点击链接即可直接导航到您的位置。');
    } catch (err) {
        // 如果复制失败，显示链接让用户手动复制
        const textArea = document.createElement('textarea');
        textArea.value = locationLink;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert('位置链接已复制到剪贴板！\n\n发送给同伴，他点击链接即可直接导航到您的位置。');
        } catch (err2) {
            alert(`复制失败，请手动复制以下链接：\n\n${locationLink}`);
        }
        document.body.removeChild(textArea);
    }
}

// 将十进制度数转换为度分秒格式
function formatToDMS(latitude, longitude) {
    const latDMS = convertToDMS(Math.abs(latitude));
    const lonDMS = convertToDMS(Math.abs(longitude));
    
    const latDir = latitude >= 0 ? 'N' : 'S';
    const lonDir = longitude >= 0 ? 'E' : 'W';
    
    return `${latDir} ${latDMS}" ${lonDir} ${lonDMS}"`;
}

// 将十进制度数转换为度分秒字符串
function convertToDMS(decimal) {
    const degrees = Math.floor(decimal);
    const minutes = Math.floor((decimal - degrees) * 60);
    const seconds = ((decimal - degrees - minutes / 60) * 3600).toFixed(4);
    
    return `${degrees}°${minutes}'${seconds}`;
}

// 位置平滑算法
function smoothPosition(positions) {
    if (positions.length === 0) {
        return { latitude: 0, longitude: 0 };
    }
    
    if (positions.length === 1) {
        return { 
            latitude: positions[0].latitude, 
            longitude: positions[0].longitude 
        };
    }
    
    // 按精度排序，移除精度最差的点
    const sortedPositions = [...positions].sort((a, b) => a.accuracy - b.accuracy);
    // 使用前80%的点（精度较好的点）
    const goodPositions = sortedPositions.slice(0, Math.ceil(sortedPositions.length * 0.8));
    
    // 检测异常值
    if (goodPositions.length >= 3) {
        // 计算平均距离
        let totalDistance = 0;
        let count = 0;
        
        for (let i = 0; i < goodPositions.length; i++) {
            for (let j = i + 1; j < goodPositions.length; j++) {
                const dist = calculateDistance(
                    goodPositions[i].latitude, goodPositions[i].longitude,
                    goodPositions[j].latitude, goodPositions[j].longitude
                );
                totalDistance += dist;
                count++;
            }
        }
        
        const avgDistance = totalDistance / count;
        
        // 移除距离其他点过远的点（超过平均距离的2倍）
        const filteredPositions = goodPositions.filter(pos => {
            let maxDist = 0;
            for (const otherPos of goodPositions) {
                if (pos === otherPos) continue;
                const dist = calculateDistance(
                    pos.latitude, pos.longitude,
                    otherPos.latitude, otherPos.longitude
                );
                maxDist = Math.max(maxDist, dist);
            }
            return maxDist < avgDistance * 2;
        });
        
        // 如果过滤后还有点，使用这些点
        if (filteredPositions.length > 0) {
            goodPositions.length = 0;
            goodPositions.push(...filteredPositions);
        }
    }
    
    // 计算加权平均值，精度越高权重越大
    let totalWeight = 0;
    let weightedLatSum = 0;
    let weightedLonSum = 0;
    
    for (const pos of goodPositions) {
        // 权重与精度成反比，精度越高（数值越小）权重越大
        const weight = 1 / Math.max(pos.accuracy, 1);
        totalWeight += weight;
        weightedLatSum += pos.latitude * weight;
        weightedLonSum += pos.longitude * weight;
    }
    
    return {
        latitude: weightedLatSum / totalWeight,
        longitude: weightedLonSum / totalWeight
    };
}

// 计算两点之间的距离（米）
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // 地球半径（米）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}