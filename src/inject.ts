;(() => {
  let data = []
  const iframes = document.getElementsByTagName('iframe')
  for (let i = 0; i < iframes.length; i++) {
    const iframe = iframes[i]
    if (iframe.getAttribute('data-iframe-detector-id') == null) {
      iframe.setAttribute('data-iframe-detector-id', i.toString())
    }
    let src = iframe.getAttribute('src')
    if (src != null) {
      data.push({ type: 'iframe', url: src })
    }
  }
  const videos = document.getElementsByTagName('video')
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i]
    if (video.getAttribute('data-video-detector-id') == null) {
      video.setAttribute('data-video-detector-id', i.toString())
    }
    let src = video.getAttribute('src')
    if (src != null) {
      data.push({ type: 'video', url: src })
    }
  }
  chrome.runtime.sendMessage({ from: 'inject', data: data })
})()
