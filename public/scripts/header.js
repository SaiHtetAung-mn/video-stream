const navHome = document.getElementById('nav-home');
const navVideos = document.getElementById('nav-videos');
const currentPath = window.location.pathname;

if(currentPath.match(/.videos$/)) {
    navHome.classList.remove('active-nav-link');
    navVideos.classList.add('active-nav-link');
}
else if(currentPath.match(/\/$/)) {
    navVideos.classList.remove('active-nav-link');
    navHome.classList.add('active-nav-link');
}
