// 全局变量
let myLatitude = null;
let myLongitude = null;
let friendLatitude = null;
let friendLongitude = null;
let watchId = null;
let compassHeading = 0;

// 位置平滑处理相关变量
let positionHistory = [];
const MAX_POSITION_HISTORY = 5; // 保存最近5个位置点
let lastAccuracy = 0; // 最后一次位置精度

// DOM 元素
const friendLocationInput = document.getElementById('friendLocation');
const myLocationDisplay = document.getElementById('myLocation');
const pasteBtn = document.getElementById('pasteBtn');
const setTargetBtn = document.getElementById('setTargetBtn');
const copyMyLocationBtn = document.getElementById('copyMyLocationBtn');
const startNavigationBtn = document.getElementById('startNavigationBtn');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 从本地存储加载朋友位置
    const savedFriendLocation = localStorage.getItem('friendLocation');
    if (savedFriendLocation) {
        friendLocationInput.value = savedFriendLocation;
    }
    
    // 获取我的位置
    startLocationTracking();
    
    // 事件监听器
    pasteBtn.addEventListener('click', handlePaste);
    setTargetBtn.addEventListener('click', setFriendLocation);
    copyMyLocationBtn.addEventListener('click', copyMyLocation);
    startNavigationBtn.addEventListener('click', startNavigation);
});

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
        alert('您的浏览器不支持地理位置服务');
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
            errorMessage = '用户拒绝了位置请求';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = '位置信息不可用';
            break;
        case error.TIMEOUT:
            errorMessage = '获取位置请求超时';
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = '发生未知错误';
            break;
    }
    myLocationDisplay.textContent = `错误: ${errorMessage}`;
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

// 处理粘贴操作
async function handlePaste() {
    try {
        const text = await navigator.clipboard.readText();
        friendLocationInput.value = text;
    } catch (err) {
        alert('无法访问剪贴板，请手动粘贴');
    }
}

// 设置朋友位置
function setFriendLocation() {
    const locationText = friendLocationInput.value.trim();
    if (!locationText) {
        alert('请输入朋友的位置信息');
        return;
    }
    
    // 解析度分秒格式的位置
    const coordinates = parseDMS(locationText);
    if (coordinates) {
        friendLatitude = coordinates.latitude;
        friendLongitude = coordinates.longitude;
        
        // 保存到本地存储
        localStorage.setItem('friendLocation', locationText);
        
        alert('已设置目标位置');
    } else {
        alert('无法解析位置信息，请确保格式正确（度分秒格式）');
    }
}

// 复制我的位置
async function copyMyLocation() {
    if (!myLatitude || !myLongitude) {
        alert('位置信息尚未获取，请稍候');
        return;
    }
    
    const locationText = myLocationDisplay.textContent;
    try {
        await navigator.clipboard.writeText(locationText);
        alert('位置信息已复制到剪贴板');
    } catch (err) {
        alert('复制失败，请手动复制');
    }
}

// 开始导航
function startNavigation() {
    if (!myLatitude || !myLongitude) {
        alert('您的位置信息尚未获取，请稍候');
        return;
    }
    
    if (!friendLatitude || !friendLongitude) {
        alert('请先设置朋友的位置');
        return;
    }
    
    // 保存位置信息到会话存储
    sessionStorage.setItem('myLatitude', myLatitude);
    sessionStorage.setItem('myLongitude', myLongitude);
    sessionStorage.setItem('friendLatitude', friendLatitude);
    sessionStorage.setItem('friendLongitude', friendLongitude);
    
    // 跳转到导航页面
    window.location.href = 'navigation.html';
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

// 解析度分秒格式的坐标
function parseDMS(dmsString) {
    // 匹配度分秒格式: N 22°13'40.6768" E 113°31'41.7773"
    const regex = /([NS])\s*(\d+)°(\d+)'([\d.]+)"\s*([EW])\s*(\d+)°(\d+)'([\d.]+)"/i;
    const match = dmsString.match(regex);
    
    if (!match) return null;
    
    const latDir = match[1].toUpperCase();
    const latDeg = parseInt(match[2]);
    const latMin = parseInt(match[3]);
    const latSec = parseFloat(match[4]);
    
    const lonDir = match[5].toUpperCase();
    const lonDeg = parseInt(match[6]);
    const lonMin = parseInt(match[7]);
    const lonSec = parseFloat(match[8]);
    
    let latitude = latDeg + (latMin / 60) + (latSec / 3600);
    let longitude = lonDeg + (lonMin / 60) + (lonSec / 3600);
    
    if (latDir === 'S') latitude = -latitude;
    if (lonDir === 'W') longitude = -longitude;
    
    return { latitude, longitude };
}