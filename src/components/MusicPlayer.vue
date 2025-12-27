<template>
    <div class="player" ref="Player">
        <div class="top">
            <div class="top-left">
                <img ref="coverImg" crossorigin="anonymous" :src="global.music.pic" :alt="global.music.name">
            </div>
            <div class="top-right">
                <div class="name-artist">
                    <div class="name">{{ global.music.name }}</div>
                    <div class="artist">{{ global.music.artist }}</div>
                </div>
                <div class="cur-lyric">{{ global.music.curLrc }}</div>
                <div class="progress-container">
                    <div class="cur-time">{{ formatTime(currentTime) }}</div>
                    <div class="progress-bar" @click="seekTo">
                        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
                    </div>
                    <div class="total-time">{{ formatTime(duration) }}</div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="controls">
                <div v-for="control in controls" :key="control.type" :class="['control', control.type]"
                    @click="control.onClicked">
                    <component :is="control.comp" :color="control.color" :fill="control.fill ?? 'transparent'" />
                </div>
            </div>
        </div>
        <audio ref="audioRef" :src="global.music.url" @loadedmetadata="onLoadedMetadata" @timeupdate="updateProgress"
            @pause="upPause" @play="upPlay" @ended="nextSong">
        </audio>
    </div>
</template>

<script setup lang='ts'>
import { Lrc } from 'lrc-kit';
import { useEnv } from "@/stores/env";
import { computed, onMounted, onUnmounted, ref, watch, type FunctionalComponent } from "vue";
import { useGlobal } from '@/stores/global';
import ColorThief from "colorthief";
import { useI18n } from 'vue-i18n';
import {
    Repeat,
    Repeat1,
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Volume1,
    Volume2,
    Shuffle,
    Volume
} from 'lucide-vue-next';

const { music: musicConfig } = useEnv();
const global = useGlobal();
const Player = ref<HTMLDivElement>();
const coverImg = ref<HTMLImageElement>();
const audioRef = ref<HTMLAudioElement | null>(null);
const colorThief = new ColorThief();
const { t } = useI18n();

// 响应式数据
const currentTime = ref(0);
const duration = ref(0);
const lyrics = ref<{ content: string; timestamp: number }[]>([]);

const emit = defineEmits(["play", "pause"]);

// 计算属性
const progressPercentage = computed(() => {
    return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
});

const controls = ref([
    {
        type: "order",
        comp: Repeat,
        color: "var(--text-color)",
        onClicked: () => { toggleOrder(); }
    },
    {
        type: "prev",
        comp: SkipBack,
        color: "var(--text-color)",
        onClicked: () => { previousSong(); }
    },
    {
        type: "play",
        comp: Play,
        color: "var(--play-color)",
        fill: "var(--play-color)",
        onClicked: () => { togglePlay(); }
    },
    {
        type: "next",
        comp: SkipForward,
        color: "var(--text-color)",
        onClicked: () => { nextSong(); }
    },
    {
        type: "volume",
        comp: Volume1,
        color: "var(--text-color)",
        onClicked: () => { toggleVolume(); }
    }
]);

// 解析歌词
const parseLrcUrl = async (url: string): Promise<{ content: string; timestamp: number }[]> => {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const lrc = Lrc.parse(text);
        if (lrc.lyrics.length === 0) throw new Error(t("music.noLyric"));
        return lrc.lyrics.filter(lyric => lyric.content.trim() !== '');
    } catch (error) {
        return [{ content: t("music.noLyric"), timestamp: 0 }];
    }
}

// 更新进度条
const updateProgress = () => {
    if (audioRef.value) {
        currentTime.value = audioRef.value.currentTime;
        updateCurrentLyric();
    }
}

// 音频元数据加载完成
const onLoadedMetadata = () => {
    if (audioRef.value) {
        duration.value = audioRef.value.duration;
        global.music.audio = audioRef.value;
    }
}

// 切换播放/暂停
const togglePlay = () => {
    if (audioRef.value?.paused) {
        audioRef.value?.play();
    } else {
        audioRef.value?.pause();
    }
}

const upPause = () => {
    emit("pause")
    const _ = controls.value.find(control => control.type === 'play');
    if (_) _.comp = Play;
    global.music.isPlaying = false;
}

const upPlay = () => {
    emit("play")
    const _ = controls.value.find(control => control.type === 'play');
    if (_) _.comp = Pause;
    global.music.isPlaying = true;
}

// 上一首
const previousSong = () => {
    if (global.music.data.length === 0) return;

    const currentIndex = global.music.data.findIndex(song => song.url === global.music.url) || 0;
    let previousIndex;

    switch (global.music.order) {
        case 'random':
            previousIndex = Math.floor(Math.random() * global.music.data.length);
            break;
        case 'single':
            if (audioRef.value) {
                audioRef.value.currentTime = 0;
                audioRef.value.play();
            }
            return;
        case 'loop':
        default:
            previousIndex = currentIndex - 1;
            if (previousIndex < 0) {
                previousIndex = global.music.data.length - 1;
            }
            break;
    }

    loadSong(global.music.data[previousIndex]);
}

// 下一首
const nextSong = () => {
    if (global.music.data.length === 0) return;

    const currentIndex = global.music.data.findIndex(song => song.url === global.music.url) || 0;
    let nextIndex;

    switch (global.music.order) {
        case 'random':
            nextIndex = Math.floor(Math.random() * global.music.data.length);
            break;
        case 'single':
            if (audioRef.value) {
                audioRef.value.currentTime = 0;
                audioRef.value.play();
            }
            return;
        case 'loop':
        default:
            nextIndex = currentIndex + 1;
            if (nextIndex >= global.music.data.length) {
                nextIndex = 0;
            }
            break;
    }

    loadSong(global.music.data[nextIndex]);
}

// 加载歌曲
const loadSong = async (song: any, autoPlay = true) => {
    global.music.url = song.url;
    global.music.name = song.name;
    global.music.artist = song.artist;
    global.music.pic = song.pic;
    global.music.lrc = song.lrc;

    // 加载歌词
    lyrics.value = await parseLrcUrl(song.lrc);

    // 重置播放状态
    currentTime.value = 0;
    global.music.curLrc = lyrics.value[0]?.content as string;

    // 重新加载音频
    if (audioRef.value) {
        audioRef.value.load();
        autoPlay && setTimeout(() => audioRef.value?.play(), 100);
    }
}

// 更新当前歌词
const updateCurrentLyric = () => {
    if (lyrics.value.length === 0) return;

    const currentTimeMs = currentTime.value;
    let currentLyricIndex = 0;

    for (let i = 0; i < lyrics.value.length; i++) {
        if (lyrics.value[i]!.timestamp <= currentTimeMs) {
            currentLyricIndex = i;
        } else {
            break;
        }
    }

    global.music.curLrc = lyrics.value[currentLyricIndex]?.content as string;
}

// 格式化时间
const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 点击进度条跳转
const seekTo = (event: MouseEvent) => {
    if (!audioRef.value || duration.value === 0) return;

    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const seekTime = percent * duration.value;

    audioRef.value.currentTime = seekTime;
    currentTime.value = seekTime;
    if (audioRef.value.paused) {
        audioRef.value.play();
    }
}

// 切换播放顺序
const toggleOrder = () => {
    const _ = controls.value.find(control => control.type === 'order');
    if (_) {
        const orders = ['random', 'loop', 'single'];
        const orderIcons = [Shuffle, Repeat, Repeat1];
        const currentIndex = orders.indexOf(global.music.order);
        const nextIndex = (currentIndex + 1) % orders.length;
        global.music.order = orders[nextIndex] as string;
        _.comp = orderIcons[nextIndex] as FunctionalComponent;
    }
}

// 切换音量
const toggleVolume = () => {
    const _ = controls.value.find(control => control.type === 'volume');
    if (audioRef.value && _) {
        const volumes = [0.3, 0.6, 1]
        const volumeIcons = [Volume, Volume1, Volume2]
        const currentIndex = volumes.indexOf(audioRef.value.volume);
        const nextIndex = (currentIndex + 1) % volumes.length;
        audioRef.value.volume = volumes[nextIndex] as number;
        _.comp = volumeIcons[nextIndex] as FunctionalComponent;
    }
}

const loadThemeColor = () => {
    const color = colorThief.getColor(coverImg.value as HTMLImageElement);
    Player.value?.style.setProperty('--theme-color', `rgb(${color[0]}, ${color[1]}, ${color[2]})`);
    global.music.themeColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

// 监听当前歌曲变化
watch(() => global.music.url, (newUrl, oldUrl) => {
    if (newUrl && newUrl !== oldUrl) {
        const currentSong = global.music.data.find(song => song.url === newUrl);
        if (currentSong) {
            loadSong(currentSong);
        }
    }
});

onMounted(async () => {
    try {
        const diffTime = (Date.now() - global.music.dataUpd);
        if (diffTime > 2 * 60 * 60 * 1000) {
            const apis = musicConfig.apis;
            for (let i = 0; i < apis.length; i++) {
                const api = apis[i] as string;
                const api_url = new URL(api);
                api_url.searchParams.set("server", musicConfig.server);
                api_url.searchParams.set("type", musicConfig.type);
                api_url.searchParams.set("id", musicConfig.id);
                const response = await fetch(api_url.href);
                if (!response.ok) continue;
                const data = await response.json() as any[];
                global.music.data = data.reverse().map((song: any) => {
                    return {
                        url: song.url,
                        name: song.name || song.title,
                        artist: song.artist || song.author,
                        pic: song.pic,
                        lrc: song.lrc
                    }
                }); global.music.dataUpd = Date.now();
                break;
            }
        }

        coverImg.value?.addEventListener('load', loadThemeColor);

        if (global.music.data.length > 0 && !global.music.url) {
            loadSong(global.music.data[0], false);
        } else {
            loadSong(global.music.data.find(song => song.url === global.music.url) || global.music.data[0], false);
        }

        const _order = controls.value.find(control => control.type === 'order');
        if (_order) {
            const orderIcons = [Shuffle, Repeat, Repeat1];
            const orderIndex = ['random', 'loop', 'single'].indexOf(global.music.order);
            _order.comp = orderIcons[orderIndex] as FunctionalComponent;
        }

        if (audioRef.value) {
            audioRef.value.volume = 0.6; // 0.3 / 0.6 / 1
        }
    } catch (error) {
        console.error('[music]', error);
    }
});

onUnmounted(() => {
    global.music.audio = null;
    global.music.isPlaying = false;
})
</script>

<style scoped>
.player {
    --theme: var(--theme-color);
    --theme-light: color-mix(in srgb, var(--theme) 20%, transparent);
    --theme-dark: color-mix(in srgb, var(--theme) 60%, transparent);

    --play-color: rgb(200, 80, 80);

    width: 80%;
    display: flex;
    padding: 1rem;
    max-width: 400px;
    border-radius: 20px;
    flex-direction: column;
    font-family: "仓耳渔阳体";
    transition: var(--transition);
    background: color-mix(in srgb, var(--main-bg), var(--theme-dark) 68%);
}

.top {
    gap: 1rem;
    display: flex;
    flex-direction: row;
}

.top-left {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;

    img {
        width: 100%;
        height: 100%;
        aspect-ratio: 1/1;
        border-radius: 1rem;
        object-fit: cover;
    }
}

.top-right {
    flex: 1;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    gap: .5rem;

    .name-artist {
        &>div {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .name {
            font-weight: bolder;
            font-size: large;
            font-weight: bold;
        }

        .artist {
            font-size: small;
            opacity: 0.8;
        }
    }

    .cur-lyric {
        font-size: small;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
        min-height: 1.2rem;
    }

    .progress-container {
        flex: 1;
        gap: .3rem;
        display: flex;
        font-size: smaller;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .progress-bar {
            flex: 1;
            height: 5px;
            background: var(--theme-dark);
            border-radius: 2.5px;
            position: relative;

            .progress {
                height: 100%;
                background: color-mix(in srgb, var(--text-color), var(--theme) 68%);
                border-radius: 2.5px;
                transition: width 0.1s ease;
            }
        }

        .cur-time,
        .total-time {
            font-size: x-small;
            min-width: 40px;
            text-align: center;
        }
    }
}

.bottom {
    display: flex;
    justify-content: center;
    margin-top: 1rem;

    .controls {
        display: flex;
        gap: 1rem;
        align-items: center;

        .control {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;

            &.play {
                transform: scale(1.5);
            }

            i {
                font-size: 1.2rem;
            }
        }
    }
}
</style>