document.getElementById('upload-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const fileInput = document.getElementById('file-input');
  const preview = document.getElementById('preview');
  const resultDiv = document.getElementById('classification-result');
  
  const file = fileInput.files[0];
  if (!file) {
      alert('이미지를 선택해주세요');
      return;
  }

  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
  
  const formData = new FormData();
  formData.append('file', file);

  try {
      resultDiv.textContent = '분류 중...';
      
      console.log('Sending file:', file.name, file.type);

      const response = await fetch('http://127.0.0.1:8000/classify', {
          method: 'POST',
          body: formData,
          headers: {
              'Accept': 'application/json',
          }
      });

      if (!response.ok) {
          const errorData = await response.json()
          throw new Error(`서버 오류가 발생했습니다: ${errorData.detail}`);
      }

      const result = await response.json();
      console.log('서버 응답:', result);
      console.log('설정할 텍스트:', `결과: ${result.pred_label}, ${result.pred_class}, ${result.pred_conf}`);
      resultDiv.style.whiteSpace = 'pre-line';
      resultDiv.textContent = `결과\n예측 레이블: ${result.pred_label}\n예측 클래스: ${result.pred_class}\n예측 신뢰도: ${result.pred_conf}%`;
      console.log('설정된 텍스트:', resultDiv.textContent);
  } catch (error) {
      resultDiv.textContent = `오류: ${error.message}`;
      console.error('Error:', error);
  }
});