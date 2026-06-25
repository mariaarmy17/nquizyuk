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
			loginForm.addEventListener('submit', async function(e){
				e.preventDefault();
				const username = document.getElementById('username').value;
				const password = document.getElementById('password').value;
				
				try {
					const response = await fetch('/api/login', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ username, password })
					});
					
					const data = await response.json();
					
					if (!response.ok) {
						alert('❌ Login Gagal\n' + data.error);
						console.error('Login error:', data);
						return;
					}
					
					// Validasi bahwa user adalah guru
					if (data.user && data.user.role === 'guru') {
						// Simpan user info ke session storage
						sessionStorage.setItem('userInfo', JSON.stringify({
							id: data.user.id,
							username: data.user.username,
							email: data.user.email,
							role: data.user.role,
							loginTime: new Date().toISOString()
						}));
						
						closeModal();
						const target = getLoginTarget();
						setTimeout(function(){
							window.location.href = target;
						}, 500);
					} else {
						alert('❌ Akses Ditolak\nAnda bukan guru, hanya guru yang dapat login');
					}
				} catch (error) {
					console.error('Error:', error);
					alert('❌ Terjadi kesalahan saat login. Coba lagi.');
				}
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
			signupForm.addEventListener('submit', async function(e){
				e.preventDefault();
				const username = document.getElementById('signupUsername').value;
				const email = document.getElementById('signupEmail')?.value || username + '@example.com';
				const password = document.getElementById('signupPassword').value;
				const confirm = document.getElementById('signupConfirm').value;
				
				if(password !== confirm){
					alert('❌ Password dan konfirmasi tidak cocok');
					return;
				}
				
				try {
					const response = await fetch('/api/signup', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ 
							username, 
							email,
							password, 
							confirm_password: confirm 
						})
					});
					
					const data = await response.json();
					
					if (!response.ok) {
						alert('❌ Daftar Gagal\n' + data.error);
						return;
					}
					
					closeModal();
					alert('✅ Akun guru berhasil dibuat!\nUsername: ' + username + '\nSilakan login untuk melanjutkan');
					setTimeout(function(){
						openModal();
						modalContent.innerHTML = loginTemplate;
						initLoginHandlers();
					}, 300);
				} catch (error) {
					console.error('Error:', error);
					alert('❌ Terjadi kesalahan saat mendaftar. Coba lagi.');
				}
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
			<h2 id="signupTitle">Daftar Akun Guru</h2>
			<form id="signupForm">
				<input type="text" id="signupUsername" placeholder="Username" required>
				<input type="email" id="signupEmail" placeholder="Email" required>
				<input type="password" id="signupPassword" placeholder="Password (min 6 karakter)" required>
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