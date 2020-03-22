const snapImage = (video) => {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  const dataUrlImage = canvas.toDataURL()
  const success = dataUrlImage.length > 100000
  if (success) {
    return dataUrlImage
  }
}

const makeImg = (dataUrlImage, width, height) => {
  const img = document.createElement('img')
  img.src = dataUrlImage
  img.width = width;
  img.height = height;
  document.getElementsByTagName('div')[0].appendChild(img)
}
const imageConfig = (w, h) => {
  const maxWidth = 200
  const maxHeight = 150
  return {
    width: () => {
      if (w > h) { // is Horizontal
        return maxWidth
      } else {
        return w * (maxHeight / h)
      }
    },
    height: () => {
      if (w > h) { // is horizontal
        return h * (maxWidth / w)
      } else {
        return maxHeight
      }
    }
  }
}
document.getElementsByTagName('input')[0].addEventListener('change', (event) => {
  const file = event.target.files[0]
  const fileReader = new FileReader()
  if (file.type.match('image')) {
    fileReader.onload = () => {
      const img = new Image()
      img.onload = function () {
        const ic = imageConfig( img.width, img.height )
        makeImg(fileReader.result, ic.width(), ic.height())
      }
      img.src = fileReader.result
    }
    fileReader.readAsDataURL(file)
  } else {
    fileReader.onload = () => {
      const blob = new Blob([fileReader.result], { type: file.type })
      const url = URL.createObjectURL(blob)
      const video = document.createElement('video')
      const timeupdate = () => {
        const dataUrlImage = snapImage(video)
        if (dataUrlImage) {
          const ic = imageConfig( video.videoWidth, video.videoHeight )
          makeImg(dataUrlImage, ic.width(), ic.height())
          video.pause()
          URL.revokeObjectURL(url)
        }
      }
      video.addEventListener('loadeddata', () => {
        const dataUrlImage = snapImage(video)
        if (dataUrlImage) {        
          const ic = imageConfig( video.videoWidth, video.videoHeight )
          makeImg(dataUrlImage, ic.width(), ic.height())
          video.removeEventListener('timeupdate', timeupdate)
          URL.revokeObjectURL(url)
        }
      })
      video.addEventListener('timeupdate', timeupdate)
      video.preload = 'metadata'
      video.src = url
      // Load video in Safari / IE11
      video.muted = true
      video.playsInline = true
      video.play()
    }
    fileReader.readAsArrayBuffer(file)
  }
})