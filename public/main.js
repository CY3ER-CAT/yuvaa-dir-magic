/* ============================================================
   YUVAA ENGINEERS — Advanced 3D Website
   Three.js Background + Interactions
   ============================================================ */

(function () {
    'use strict';

    /* ==================== LOADER ==================== */
    window.addEventListener('load', function () {
        setTimeout(function () {
            document.getElementById('loader').classList.add('hidden');
        }, 2000);
    });

    /* ==================== CUSTOM CURSOR ==================== */
    const cursor = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    document.querySelectorAll('[data-cursor="hover"]').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', function () {
            document.body.classList.remove('cursor-hover');
        });
    });

    /* ==================== NAVBAR ==================== */
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        var scroll = window.pageYOffset;

        if (scroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scroll;
    });

    /* ==================== MOBILE MENU ==================== */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    menuToggle.addEventListener('click', function () {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ==================== REVEAL ANIMATIONS ==================== */
    const revealElements = document.querySelectorAll('.reveal, .reveal-text');

    revealElements.forEach(function (el) {
        var delay = el.getAttribute('data-delay') || 0;
        el.style.setProperty('--reveal-delay', delay + 'ms');
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (el) {
        observer.observe(el);
    });

    /* ==================== STAT COUNTER ==================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;

        statNumbers.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'));
            var suffix = el.getAttribute('data-suffix') || '';
            var duration = 2000;
            var startTime = performance.now();

            function update(currentTime) {
                var elapsed = currentTime - startTime;
                var progress = Math.min(elapsed / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var value = Math.floor(eased * target);

                el.textContent = value + (progress === 1 ? suffix : '');

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target + suffix;
                }
            }

            requestAnimationFrame(update);
        });
    }

    var statsSection = document.getElementById('stats');
    if (statsSection) {
        var statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateStats();
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    /* ==================== 3D TILT CARDS ==================== */
    var tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = ((y - centerY) / centerY) * -8;
            var rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
            card.style.setProperty('--mx', (x / rect.width * 100) + '%');
            card.style.setProperty('--my', (y / rect.height * 100) + '%');
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    /* ==================== THREE.JS BACKGROUND ==================== */
    var canvas = document.getElementById('bg-canvas');
    var scene, camera, renderer;
    var particles, particles2, floatingShapes = [];
    var mouseTargetX = 0, mouseTargetY = 0;
    var scrollOffset = 0;

    function initThree() {
        if (typeof THREE === 'undefined') return;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x06070d, 0.035);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        /* Particle systems removed per design — no background squares */

        /* --- Floating Wireframe Shapes --- */
        var shapeGeometries = [
            new THREE.IcosahedronGeometry(3, 0),
            new THREE.OctahedronGeometry(2.5, 0),
            new THREE.TetrahedronGeometry(3, 0),
            new THREE.DodecahedronGeometry(2.5, 0),
            new THREE.TorusGeometry(3, 0.5, 8, 16),
            new THREE.IcosahedronGeometry(2, 1),
            new THREE.OctahedronGeometry(3, 0),
            new THREE.TetrahedronGeometry(2, 0),
        ];

        for (var k = 0; k < shapeGeometries.length; k++) {
            var edges = new THREE.EdgesGeometry(shapeGeometries[k]);
            var lineMaterial = new THREE.LineBasicMaterial({
                color: k % 3 === 0 ? 0x00e5ff : k % 3 === 1 ? 0x7c5cff : 0xff3d71,
                transparent: true,
                opacity: 0.25
            });

            var shape = new THREE.LineSegments(edges, lineMaterial);
            shape.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 40 - 10
            );

            shape.userData = {
                rotSpeedX: (Math.random() - 0.5) * 0.005,
                rotSpeedY: (Math.random() - 0.5) * 0.005,
                rotSpeedZ: (Math.random() - 0.5) * 0.003,
                floatSpeed: Math.random() * 0.3 + 0.1,
                floatOffset: Math.random() * Math.PI * 2,
                baseY: shape.position.y
            };

            floatingShapes.push(shape);
            scene.add(shape);
        }

        /* --- Ambient Light --- */
        var ambientLight = new THREE.AmbientLight(0x404060, 0.5);
        scene.add(ambientLight);

        /* --- Point Lights for glow --- */
        var pointLight1 = new THREE.PointLight(0x00e5ff, 1, 100);
        pointLight1.position.set(20, 20, 30);
        scene.add(pointLight1);

        var pointLight2 = new THREE.PointLight(0x7c5cff, 1, 100);
        pointLight2.position.set(-20, -10, 20);
        scene.add(pointLight2);

        animate();
    }

    var clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        var time = clock.getElapsedTime();
        var delta = clock.getDelta();

        /* Smooth mouse following */
        mouseTargetX += (mouseX - mouseTargetX) * 0.05;
        mouseTargetY += (mouseY - mouseTargetY) * 0.05;

        /* Rotate particle systems */
        if (particles) {
            particles.rotation.y = time * 0.03;
            particles.rotation.x = time * 0.01;
            particles.rotation.z = (mouseTargetX / window.innerWidth - 0.5) * 0.3;
        }

        if (particles2) {
            particles2.rotation.y = -time * 0.02;
            particles2.rotation.x = -time * 0.008;
        }

        /* Animate floating shapes */
        for (var i = 0; i < floatingShapes.length; i++) {
            var shape = floatingShapes[i];
            var data = shape.userData;

            shape.rotation.x += data.rotSpeedX;
            shape.rotation.y += data.rotSpeedY;
            shape.rotation.z += data.rotSpeedZ;

            shape.position.y = data.baseY + Math.sin(time * data.floatSpeed + data.floatOffset) * 3;
            shape.position.x += Math.cos(time * 0.1 + data.floatOffset) * 0.01;

            /* Parallax based on mouse */
            shape.position.z = -10 + (mouseTargetX / window.innerWidth - 0.5) * 10;
        }

        /* Camera parallax */
        camera.position.x += ((mouseTargetX / window.innerWidth - 0.5) * 5 - camera.position.x) * 0.05;
        camera.position.y += (-(mouseTargetY / window.innerHeight - 0.5) * 5 - camera.position.y) * 0.05;

        /* Scroll-based camera movement */
        scrollOffset = window.pageYOffset * 0.01;
        camera.position.z = 50 + scrollOffset;

        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    /* ==================== RESIZE ==================== */
    window.addEventListener('resize', function () {
        if (renderer && camera) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    });

    /* ==================== SCROLL PARALLAX FOR HERO ==================== */
    var heroContent = document.querySelector('.hero-content');
    var heroBadge = document.querySelector('.hero-badge');

    window.addEventListener('scroll', function () {
        var scrolled = window.pageYOffset;

        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = 'translateY(' + scrolled * 0.3 + 'px)';
            heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        }
    });

    /* ==================== FORM HANDLING ==================== */
    var forms = document.querySelectorAll('form.form-card');

    forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var requiredFields = form.querySelectorAll('[required]');
            var valid = true;

            requiredFields.forEach(function (field) {
                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = 'var(--accent-3)';
                } else {
                    field.style.borderColor = '';
                }
            });

            if (!valid) return;

            form.style.display = 'none';
            var success = document.getElementById('form-success');
            if (success) {
                success.classList.add('show');
                success.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    /* ==================== GALLERY FILTER ==================== */
    var galleryFilter = document.getElementById('gallery-filter');
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryFilter) {
        galleryFilter.querySelectorAll('button').forEach(function (btn) {
            btn.addEventListener('click', function () {
                galleryFilter.querySelectorAll('button').forEach(function (b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');

                var filter = btn.getAttribute('data-filter');

                galleryItems.forEach(function (item) {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = '';
                        item.classList.add('visible');
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ==================== DATE INPUT MIN TODAY ==================== */
    var dateInputs = document.querySelectorAll('input[type="date"]');
    var today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(function (input) {
        input.setAttribute('min', today);
    });

    /* ==================== INIT ==================== */
    initThree();

})();

/* ==================== SIDEBAR TOGGLE + HERO 3D ==================== */
(function () {
    'use strict';

    // Sidebar open/close
    document.addEventListener('DOMContentLoaded', function () {
        var toggle = document.getElementById('sidebar-toggle');
        var sidebar = document.getElementById('services-sidebar');
        if (!toggle || !sidebar) return;

        function setOpen(open) {
            document.body.classList.toggle('sidebar-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
        toggle.addEventListener('click', function () {
            setOpen(!document.body.classList.contains('sidebar-open'));
        });
        // Close sidebar when clicking a service link
        sidebar.querySelectorAll('.sidebar-link').forEach(function (link) {
            link.addEventListener('click', function () { setOpen(false); });
        });
        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });
    });

    // Hero 3D rotating wireframe building
    window.addEventListener('load', function () {
        if (typeof THREE === 'undefined') return;
        var mount = document.getElementById('hero-3d');
        if (!mount) return;

        var w = mount.clientWidth || window.innerWidth;
        var h = mount.clientHeight || window.innerHeight;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
        camera.position.set(0, 2, 12);

        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(w, h);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        // A group of stacked gold wireframe blocks forming a building
        var group = new THREE.Group();
        var heights = [3.2, 2.4, 1.8, 1.2, 0.7];
        var yCursor = -2.5;
        heights.forEach(function (hh, i) {
            var w0 = 2.6 - i * 0.32;
            var geo = new THREE.BoxGeometry(w0, hh, w0);
            var edges = new THREE.EdgesGeometry(geo);
            var mat = new THREE.LineBasicMaterial({
                color: i % 2 === 0 ? 0xd4af37 : 0xf5c518,
                transparent: true,
                opacity: 0.85
            });
            var block = new THREE.LineSegments(edges, mat);
            block.position.y = yCursor + hh / 2;
            yCursor += hh + 0.05;
            group.add(block);
        });

        // Glowing apex
        var apex = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.45, 0),
            new THREE.MeshBasicMaterial({ color: 0xf5c518, wireframe: true })
        );
        apex.position.y = yCursor + 0.6;
        group.add(apex);

        // Orbiting ring
        var ring = new THREE.Mesh(
            new THREE.TorusGeometry(4.5, 0.04, 16, 100),
            new THREE.MeshBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.5 })
        );
        ring.rotation.x = Math.PI / 2.2;
        group.add(ring);

        scene.add(group);

        // Mouse parallax
        var mx = 0, my = 0;
        window.addEventListener('mousemove', function (e) {
            mx = (e.clientX / window.innerWidth - 0.5) * 0.6;
            my = (e.clientY / window.innerHeight - 0.5) * 0.4;
        });

        function resize() {
            var nw = mount.clientWidth || window.innerWidth;
            var nh = mount.clientHeight || window.innerHeight;
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
        }
        window.addEventListener('resize', resize);

        function loop() {
            group.rotation.y += 0.005;
            group.rotation.x += (my - group.rotation.x) * 0.04;
            group.position.x += (mx * 2 - group.position.x) * 0.04;
            apex.rotation.y += 0.03;
            apex.rotation.x += 0.02;
            ring.rotation.z += 0.004;
            renderer.render(scene, camera);
            requestAnimationFrame(loop);
        }
        loop();
    });
})();
