document.addEventListener('DOMContentLoaded', () => {
  const imageSelect = document.getElementById('image-select');
  const imageUpload = document.getElementById('image-upload');
  const textInput = document.getElementById('text-input');
  const fontSizeSlider = document.getElementById('fontsize-slider');
  const lineHeightSlider = document.getElementById('line-height-slider');
  const watermarkCheckbox = document.getElementById('watermark-checkbox');
  const saveBtn = document.getElementById('save-btn');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const canvasWidth = 512;

  const quotes = [
    "我敬佩两种人\n年轻时陪男人过苦日子的女人\n富裕时陪女人过好日子的男人",
    "人生就像一杯茶\n不会苦一辈子\n但总会苦一阵子",
    "不要总拿自己跟别人比\n你羡慕别人瘦\n别人还羡慕你肠胃好\n你羡慕别人有钱\n别人还羡慕没人找你借钱",
    "彪悍的人生不需要解释\n只要你按时达到目的地\n很少有人在乎你开的是奔驰还是拖拉机",
    "如果你不够优秀\n人脉是不值钱的\n它不是追求来的\n而是吸引来的\n只有等价的交换\n才能得到合理的帮助\n虽然听起来很冷\n但这是事实",
    "喜欢在你背后说三道四\n捏造故事的人\n无非就三个原因\n没达到你的层次\n你有的东西他没有\n模仿你的生活方式未遂",
    "做一个特别简单的人\n好相处就处\n不好相处就不处\n不要一厢情愿去迎合别人\n你努力合群的样子并不漂亮\n不必对每个人好\n他们又不给你打钱"
  ];
  const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
  textInput.placeholder = selectedQuote;

  canvas.width = canvasWidth;
  let image = new Image();
  image.onload = renderImage;

  imageSelect.addEventListener('change', () => image.src = imageSelect.value);
  imageSelect.selectedIndex = Math.floor(Math.random() * imageSelect.options.length);
  imageSelect.dispatchEvent(new Event('change'));
  imageUpload.addEventListener('change', () => {
    const [file] = imageUpload.files;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => image.src = e.target.result;
    reader.readAsDataURL(file);
  });

  textInput.addEventListener('input', renderImage);
  fontSizeSlider.addEventListener('input', renderImage);
  lineHeightSlider.addEventListener('input', renderImage);
  watermarkCheckbox.addEventListener('change', renderImage);

  canvas.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = canvas.toDataURL();
    link.click();
  });

  function renderImage() {
    const scaleFactor = canvasWidth / image.width;
    const scaledHeight = image.height * scaleFactor;
    const fontSize = parseInt(fontSizeSlider.value);
    const lineHeight = fontSize * parseFloat(lineHeightSlider.value);
    const imageLineHeight = lineHeight / scaleFactor;
    const value = textInput.value || textInput.placeholder;
    const lines = value.split('\n');
    canvas.width = canvasWidth;
    canvas.height = scaledHeight + (lines.length - 1) * lineHeight;
    ctx.drawImage(image, 0, 0, canvas.width, scaledHeight);
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) {
        const sx = 0, sy = image.height - imageLineHeight, sw = image.width, sh = imageLineHeight;
        const dx = 0, dy = scaledHeight + (i - 1) * lineHeight, dw = canvas.width, dh = lineHeight;
        ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
      }
      const y = scaledHeight + i * lineHeight - (lineHeight - fontSize) / 2;
      ctx.fillText(lines[i], canvas.width / 2, y);
    }
    if (!watermarkCheckbox.checked) {
      ctx.font = '12px Arial';
      ctx.fillStyle = '#cccccc';
      ctx.textAlign = 'right';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(document.title, canvas.width - 5, canvas.height - 17);
      const author = document.querySelector('meta[name="twitter:creator"]');
      ctx.fillText(author.content, canvas.width - 5, canvas.height - 5);
    }
  }
});