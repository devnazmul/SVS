// ===========================================
// #00127
// ===========================================

export const playAlartSound = () => {
    const audio = new Audio('/assets/alart.wav');
    audio.volume=0.05
    audio.play()
}