console.log("NQUIZYUK READY");
document.addEventListener('DOMContentLoaded', function(){
	const modal = document.getElementById('loginModal');
	if(!modal) return;

	const modalContent = modal.querySelector('.modal-content');
	let loginTemplate = modalContent.innerHTML;

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
		const modalClose = document.getElementById('modalClose');
		const loginForm = document.getElementById('loginForm');
		const signupLink = document.getElementById('signupLink');

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
				// Redirect ke halaman input room code
				setTimeout(function(){
					window.location.href = 'src/pages/room-code.html';
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

	// initialize handlers for the initial login template
	initLoginHandlers();

});