export default function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // 지구의 반지름(단위: km)
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c * 1000; // 거리(단위: m)
    return Math.floor(distance);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}