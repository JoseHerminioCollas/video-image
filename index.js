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

const makeImg = (dataUrlImage) => {
  const img = document.createElement('img')
  img.src = dataUrlImage
  document.getElementsByTagName('div')[0].appendChild(img)
}

document.getElementsByTagName('input')[0].addEventListener('change', (event) => {
  const file = event.target.files[0]
  const fileReader = new FileReader()
  if (file.type.match('image')) {
    fileReader.onload = () => {
      const img = document.createElement('img')
      img.src = fileReader.result
      document.getElementsByTagName('div')[0].appendChild(img)
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
          makeImg(dataUrlImage)
          video.removeEventListener('timeupdate', timeupdate)
          video.pause()
          URL.revokeObjectURL(url)
        }
      }
      video.addEventListener('loadeddata', () => {
        const dataUrlImage = snapImage(video)
        if (dataUrlImage) {
          makeImg(dataUrlImage)
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