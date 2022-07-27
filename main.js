const container = document.querySelector('.container'),
mainVideo = container.querySelector('video'),
progressBar = container.querySelector('.progress-bar'),
videoTimeline= container.querySelector('.video-timeline'),
volumeBtn = container.querySelector('.volume i'),
volumeSlider = container.querySelector('.left input'),
currentVidTime = container.querySelector('.current-time'),
videoDuration= container.querySelector('.video-duration'),
skipBackward = container.querySelector('.skip-backward i'),
skipForward = container.querySelector('.skip-forward i'),
playPauseBtn = container.querySelector('.play-pause i'),
speedBtn = container.querySelector('.playback-speed span'),
speedOptions = container.querySelector('.speed-options'),
picInPicBtn= container.querySelector('.pic-in-pic span'),
fullscreenBtn= container.querySelector('.fullscreen i');

let timer;

const hideControls = ()=>{
    if (mainVideo.paused) return;
    timer = setTimeout(()=>{
        container.classList.remove('show-controls');
    }, 3000);
};

hideControls();

container.addEventListener('mousemove', ()=>{
    container.classList.add('show-controls');
    clearTimeout(timer);
    hideControls();
});

const formatTime = time =>{
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0){
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`;
};


mainVideo.addEventListener('timeupdate', e =>{
    let {currentTime, duration} = e.target; //getting the current time and duration of the video
    // console.log(currentTime, duration);
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener('loadeddata',e =>{
    videoDuration.innerText= formatTime(e.target.duration);
});

videoTimeline.addEventListener('click',e =>{
    let timelineWidth = e.target.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

const draggableProgessBar = e =>{
    let timelineWidth = e.target.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
};

videoTimeline.addEventListener('mousedown',() =>{
    videoTimeline.addEventListener('mousemove',draggableProgessBar);
});

container.addEventListener('mouseup',() =>{
    videoTimeline.removeEventListener('mousemove',draggableProgessBar);
});

videoTimeline.addEventListener('mousemove', e=>{
    const progressTime = videoTimeline.querySelector('span');
    let offsetX = e.offsetX;
    progressTime.style.left = `${offsetX}px` ;
    let timelineWidth = videoTimeline.clientWidth;
    let percent = (e.offsetX / timelineWidth) * mainVideo.duration;
    progressTime.innerText = formatTime(percent);
});

volumeBtn.addEventListener('click',()=>{
    if(!volumeBtn.classList.contains('fa-volume-high')){
        mainVideo.volume = .5;
        volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');

    }else {
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
    }
    volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener('input',e =>{
    mainVideo.volume = e.target.value;
    if(e.target.value == 0){
        volumeBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
    } else{
        volumeBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
    }
});

speedBtn.addEventListener('click',()=>{
    speedOptions.classList.toggle('show');
});

picInPicBtn.addEventListener('click',()=>{
    mainVideo.requestPictureInPicture();
});

fullscreenBtn.addEventListener('click',()=>{
    // mainVideo.requestFullscreen();
    container.classList.toggle('fullscreen');
    if(document.fullscreenElement){
        fullscreenBtn.classList.replace('fa-compress', 'fa-expand')
        return document.exitFullscreen();
    }
    fullscreenBtn.classList.replace('fa-expand', 'fa-compress')
    container.requestFullscreen();
});

speedOptions.querySelectorAll('li').forEach(option =>{
    // console.log(option)
    option.addEventListener('click',()=>{
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector('.active').classList.remove('active');
        option.classList.add('active');
    });
});

document.addEventListener('click', e =>{
    if(e.target.tagName !== 'SPAN' || e.target.className !== 'material-symbols-rounded'){
        speedOptions.classList.remove('show');
    }
});

skipBackward.addEventListener('click', () => {
    mainVideo.currentTime -= 5;
});

skipForward.addEventListener('click', () => {
    mainVideo.currentTime += 5;
});

playPauseBtn.addEventListener('click',()=>{
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener('click',()=>{
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

document.addEventListener('keydown',e =>{
    if (e.code === 'Space'){
        mainVideo.paused ? mainVideo.play() : mainVideo.pause();
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft'){
        mainVideo.currentTime -= 5;
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight'){
        mainVideo.currentTime += 5;
    }
});


mainVideo.addEventListener('play', ()=>{
    playPauseBtn.classList.replace("fa-play", "fa-pause");
});

mainVideo.addEventListener('pause', ()=>{
    playPauseBtn.classList.replace("fa-pause", "fa-play");
});