export function degreesToRads(x) {
    return x * (Math.PI / 180)
}
export function darkenRGB(rgb, darken = 20) {
    if (typeof rgb !== "string") {
        console.error("Invalid input to darkenRGB:", rgb);
        return "rgb(0, 0, 0)";
    }

    const match = rgb.match(/\d+(\.\d+)?/g);
    if (!match || match.length < 3) return rgb;

    const r = Math.max(0, parseInt(match[0], 10) - darken);
    const g = Math.max(0, parseInt(match[1], 10) - darken);
    const b = Math.max(0, parseInt(match[2], 10) - darken);
    const a = match[3] !== undefined ? parseFloat(match[3]) : undefined;

    if (a !== undefined) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    } else {
        return `rgb(${r}, ${g}, ${b})`;
    }
}
export function minMax(min, max) {
    return Math.random() * (max - min + 1) + min
}
export function getAngle(x, y) {
    return Math.atan2(y, x)
}
export function removeElement(element, array) {
    return array.splice(array.indexOf(element), 1)
}
export function getDist(e1, e2) {
    let dx = e1.x - e2.x
    let dy = e1.y - e2.y
    let dist = dx*dx+dy*dy

    return dist
}
export function abbreviate(n) {
    if (n < 1000) return n;
    let suffixes = ["k", "m", "b", "t", "qa", "qi", "sx", "sp", "oc", "no", "dc"]
    for (let i = suffixes.length-1; i >= 0; i--) {
        if (n >= Math.pow(10,3*(i+1))) {
            n /= Math.pow(10,3*(i+1))
            return n.toFixed(2) + suffixes[i]
            break;
        }
    }
}
export function randomElement(x) {
    return Math.floor(Math.random()*x.length)
}
export function mouseRectCollision(mx, my, bx, by, bl) {
    return (
        mx >= bx-bl && 
        mx <= bx+bl &&
        my >= by-bl && 
        my <= by+bl
    )
}