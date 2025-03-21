// 全局变量
let myLatitude = null;
let myLongitude = null;
let friendLatitude = null;
let friendLongitude = null;
let watchId = null;
let compassHeading = 0;
let distance = 0;

// 位置平滑处理相关变量
let positionHistory = [];
const MAX_POSITION_HISTORY = 5; // 保存最近5个位置点
let lastAccuracy = 0; // 最后一次位置精度

// DOM 元素
const friendLocationDisplay = document.getElementById('friendLocationDisplay');
const myLocationDisplay = document.getElementById('myLocationDisplay');
const distanceValue = document.getElementById('distanceValue');
const altitudeValue = document.getElementById('altitudeValue');
const speedValue = document.getElementById('speedValue');
const backBtn = document.getElementById('backBtn');
const returnBtn = document.getElementById('returnBtn');
const mapViewBtn = document.getElementById('mapViewBtn');
const navigationCanvas = document.getElementById('navigationCanvas');
const ctx = navigationCanvas.getContext('2d');

// 图标资源
const friendIcon = new Image();
const myIcon = new Image();
let iconsLoaded = 0;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 从会话存储获取位置信息
    myLatitude = parseFloat(sessionStorage.getItem('myLatitude'));
    myLongitude = parseFloat(sessionStorage.getItem('myLongitude'));
    friendLatitude = parseFloat(sessionStorage.getItem('friendLatitude'));
    friendLongitude = parseFloat(sessionStorage.getItem('friendLongitude'));
    
    // 加载图标
    loadIcons();
    
    // 显示初始位置信息
    updateLocationDisplays();
    
    // 开始位置追踪
    startLocationTracking();
    
    // 事件监听器
    backBtn.addEventListener('click', goBack);
    returnBtn.addEventListener('click', goBack);
    mapViewBtn.addEventListener('click', openMapView);
    
    // 设置Canvas大小
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 初始化指南针指示器
    updateCompassIndicator();
    
    // 开始绘制导航
    requestAnimationFrame(drawNavigation);
});

// 加载图标
function loadIcons() {
    // 使用SVG内联数据
    friendIcon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="%234285f4"/><circle cx="12" cy="8" r="4" fill="white"/><path d="M12,14 C8.7,14 6,16.7 6,20 L18,20 C18,16.7 15.3,14 12,14 Z" fill="white"/></svg>';
    myIcon.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><polygon points="12,0 24,24 12,18 0,24" fill="%2334a853"/></svg>';
    
    friendIcon.onload = iconLoaded;
    myIcon.onload = iconLoaded;
}

function iconLoaded() {
    iconsLoaded++;
    if (iconsLoaded === 2) {
        // 两个图标都加载完成，重新绘制
        drawNavigation();
    }
}

// 调整Canvas大小
function resizeCanvas() {
    const container = navigationCanvas.parentElement;
    navigationCanvas.width = container.clientWidth;
    navigationCanvas.height = container.clientHeight;
    drawNavigation();
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
    
    // 更新高度和速度信息
    if (position.coords.altitude !== null) {
        altitudeValue.textContent = `${position.coords.altitude.toFixed(1)} 米`;
    } else {
        altitudeValue.textContent = '未知 米';
    }
    
    if (position.coords.speed !== null) {
        speedValue.textContent = `${position.coords.speed.toFixed(1)} m/s`;
    } else {
        speedValue.textContent = '0 m/s';
    }
    
    // 添加精度信息显示
    const accuracyElement = document.getElementById('accuracyValue');
    if (accuracyElement) {
        accuracyElement.textContent = `${Math.round(lastAccuracy)} 米`;
    }
    
    // 计算距离
    distance = calculateDistance(myLatitude, myLongitude, friendLatitude, friendLongitude);
    distanceValue.textContent = Math.round(distance);
    
    // 更新位置显示
    updateLocationDisplays();
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
    alert(`错误: ${errorMessage}`);
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
    
    // 更新指南针指示器
    updateCompassIndicator();
    
    // 重新绘制导航
    drawNavigation();
}

// 更新位置显示
function updateLocationDisplays() {
    // 转换为度分秒格式并显示
    friendLocationDisplay.textContent = formatToDMS(friendLatitude, friendLongitude);
    myLocationDisplay.textContent = formatToDMS(myLatitude, myLongitude);
}

// 更新指南针指示器
function updateCompassIndicator() {
    const compassElement = document.querySelector('.compass-indicator');
    if (compassElement) {
        // 根据设备方向旋转指南针
        compassElement.style.transform = `rotate(${compassHeading}deg)`;
    }
}

// 绘制导航
function drawNavigation() {
    // 清除画布
    ctx.clearRect(0, 0, navigationCanvas.width, navigationCanvas.height);
    
    const centerX = navigationCanvas.width / 2;
    const centerY = navigationCanvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // 绘制背景网格
    drawGrid(centerX, centerY, radius);
    
    // 计算朋友位置相对于我的位置的方向
    const bearing = calculateBearing(myLatitude, myLongitude, friendLatitude, friendLongitude);
    
    // 根据设备方向调整朋友位置的显示角度
    const adjustedBearing = (bearing - compassHeading + 360) % 360;
    const friendX = centerX + radius * Math.sin(adjustedBearing * Math.PI / 180);
    const friendY = centerY - radius * Math.cos(adjustedBearing * Math.PI / 180);
    
    // 绘制连接线（虚线）
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(friendX, friendY);
    ctx.strokeStyle = '#2997ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 绘制距离指示
    const midX = centerX + (friendX - centerX) / 2;
    const midY = centerY + (friendY - centerY) / 2;
    ctx.font = '12px Inter';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.round(distance)}m`, midX, midY - 10);
    
    // 绘制朋友图标
    if (iconsLoaded === 2) {
        // 添加发光效果
        ctx.save();
        ctx.shadowColor = '#2997ff';
        ctx.shadowBlur = 15;
        ctx.drawImage(friendIcon, friendX - 15, friendY - 15, 30, 30);
        ctx.restore();
        
        // 绘制我的位置图标（箭头始终指向上方）
        ctx.save();
        ctx.shadowColor = '#34a853';
        ctx.shadowBlur = 15;
        ctx.drawImage(myIcon, centerX - 15, centerY - 15, 30, 30);
        ctx.restore();
    } else {
        // 如果图标未加载完成，使用简单图形代替
        // 朋友位置（蓝色圆点）
        ctx.save();
        ctx.shadowColor = '#2997ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(friendX, friendY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#2997ff';
        ctx.fill();
        ctx.restore();
        
        // 我的位置（绿色三角形，始终指向上方）
        ctx.save();
        ctx.shadowColor = '#34a853';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - 15);
        ctx.lineTo(centerX + 10, centerY + 10);
        ctx.lineTo(centerX - 10, centerY + 10);
        ctx.closePath();
        ctx.fillStyle = '#34a853';
        ctx.fill();
        ctx.restore();
    }
    
    // 继续动画
    requestAnimationFrame(drawNavigation);
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

// 计算方位角（度）
function calculateBearing(lat1, lon1, lat2, lon2) {
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360; // 转换为0-360度
    
    return bearing;
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

// 返回首页
function goBack() {
    // 停止位置追踪
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }
    
    // 返回首页
    window.location.href = 'index.html';
}

// 绘制背景网格
function drawGrid(centerX, centerY, radius) {
    // 绘制同心圆
    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * i / 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // 绘制方向线
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * Math.PI / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
        );
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // 绘制中心点
    ctx.beginPath();
    ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
}

// 打开地图视图
function openMapView() {
    // 这里可以实现打开地图的功能
    // 例如使用第三方地图服务
    alert('地图功能开发中');
}