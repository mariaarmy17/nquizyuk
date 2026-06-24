console.log("NQUIZYUK READY");
document.addEventListener('DOMContentLoaded', function(){
	const modal = document.getElementById('loginModal');
	if(!modal) return;

	const modalContent = modal.querySelector('.modal-content');
	let loginTemplate = modalContent.innerHTML;

	function isLoggedIn(){
		return !!sessionStorage.getItem('userInfo');
	}

	function getLoginTarget(){
		const target = sessionStorage.getItem('loginTarget');
		if(!target) return 'src/pages/room-code.html';
		sessionStorage.removeItem('loginTarget');
		return target;
	}

	function openLoginModalFor(target){
		sessionStorage.setItem('loginTarget', target);
		openModal();
	}

	function openModal(){
		modal.classList.add('open');
		modal.setAttribute('aria-hidden','false');
	}
	function closeModal(){
		modal.classList.remove('open');
		modal.setAttribute('aria-hidden','true');
	}

	// click outside to close (added once)
	window.addEventListener('click', function(e){
		if(e.target === modal){
			closeModal();
		}
	});

	function initLoginHandlers(){
		const loginBtn = document.getElementById('loginBtn');
		const guruBtn = document.getElementById('guruBtn');
		const modalClose = document.getElementById('modalClose');
		const loginForm = document.getElementById('loginForm');
		const signupLink = document.getElementById('signupLink');

		if(guruBtn){
			guruBtn.addEventListener('click', function(){
				if(isLoggedIn()){
					window.location.href = 'src/pages/pilih-quiz.html';
					return;
				}
				openLoginModalFor('src/pages/pilih-quiz.html');
			});
		}

		if(loginBtn){
			loginBtn.addEventListener('click', function(){
				openModal();
				const userInput = document.getElementById('username');
				if(userInput) userInput.focus();
			});
		}

		if(modalClose){
			modalClose.addEventListener('click', function(){ closeModal(); });
		}

		if(loginForm){
			loginForm.addEventListener('submit', function(e){
				e.preventDefault();
				const username = document.getElementById('username').value;
				const password = document.getElementById('password').value;
				console.log('Login submit', {username, password});
				
				// Simpan user info ke session storage
				sessionStorage.setItem('userInfo', JSON.stringify({
					username: username,
					loginTime: new Date().toISOString()
				}));
				
				closeModal();
				const target = getLoginTarget();
				setTimeout(function(){
					window.location.href = target;
				}, 500);
			});
		}

		if(signupLink){
			signupLink.addEventListener('click', function(e){
				e.preventDefault();
				openSignup();
			});
		}
	}

	function initSignupHandlers(){
		const modalClose = document.getElementById('modalClose');
		const signupForm = document.getElementById('signupForm');
		const backToLogin = document.getElementById('backToLogin');

		if(modalClose) modalClose.addEventListener('click', function(){ closeModal(); });

		if(signupForm){
			signupForm.addEventListener('submit', function(e){
				e.preventDefault();
				const username = document.getElementById('signupUsername').value;
				const password = document.getElementById('signupPassword').value;
				const confirm = document.getElementById('signupConfirm').value;
				if(password !== confirm){
					alert('Password dan konfirmasi tidak cocok');
					return;
				}
				console.log('Signup submit', {username, password});
				closeModal();
				alert('Akun dibuat\nUsername: ' + username);
			});
		}

		if(backToLogin){
			backToLogin.addEventListener('click', function(e){
				e.preventDefault();
				modalContent.innerHTML = loginTemplate;
				initLoginHandlers();
			});
		}
	}

	function openSignup(){
		const signupTemplate = `
			<button class="modal-close" id="modalClose" aria-label="Tutup">×</button>
			<h2 id="signupTitle">Daftar</h2>
			<form id="signupForm">
				<input type="text" id="signupUsername" placeholder="Username" required>
				<input type="password" id="signupPassword" placeholder="Password" required>
				<input type="password" id="signupConfirm" placeholder="Konfirmasi Password" required>
				<button type="submit" class="login-btn">Daftar</button>
			</form>
			<p class="modal-footer">Sudah punya akun? <a href="#" id="backToLogin">Login</a></p>
		`;
		modalContent.innerHTML = signupTemplate;
		initSignupHandlers();
		openModal();
	}

	function initNlpAssistant(){
		const questionInput = document.getElementById('nlpQuestion');
		const sendButton = document.getElementById('nlpSend');
		const resultBox = document.getElementById('nlpResult');

		if(!questionInput || !sendButton || !resultBox) return;

		async function sendNlpQuestion(){
			const question = questionInput.value.trim();
			if(!question){
				resultBox.textContent = 'Silakan ketik pertanyaan terlebih dahulu.';
				return;
			}

			resultBox.textContent = 'Memproses...';

			try {
				const response = await fetch('/api/nlp', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ question })
				});

				const data = await response.json();
				if(!response.ok){
					resultBox.textContent = data.error || 'Terjadi kesalahan saat memproses pertanyaan.';
					return;
				}

				resultBox.innerHTML = `<strong>Jawaban:</strong> ${data.answer}`;
			} catch (error) {
				console.error(error);
				resultBox.textContent = 'Gagal menghubungi server. Coba lagi.';
			}
		}

		sendButton.addEventListener('click', sendNlpQuestion);
		questionInput.addEventListener('keydown', function(event){
			if(event.key === 'Enter'){
				event.preventDefault();
				sendNlpQuestion();
			}
		});
	}

	// initialize handlers for the initial login template
	initLoginHandlers();
	initNlpAssistant();

});