
var MAP_API = {

	AVIATION_API_URL: "http://192.168.64.2/dashboard/API/api/airports",
	map: null,
	airports: null,

	initMap: function () {

		this.buildMap();
		this.fetchData();
		this.initForm();
	},

	buildMap: function () {

		map = new google.maps.Map(document.getElementById("map"), {
			center: { lat: 48.8534, lng: 2.3488 },
			zoom: 6,
		});
		map.setOptions({ disableDoubleClickZoom: true })
		this.toggleForm(map);
	},

	fetchData: async function () {

		var icon = {
			url: "./img/plane.svg",
			anchor: new google.maps.Point(10, 10),
			scaledSize: new google.maps.Size(20, 20)
		};

		fetch(this.AVIATION_API_URL)
			.then(response => response.json())
			.then(response => {

				for (const ap of response.data) {

					marker = new google.maps.Marker({
						position: new google.maps.LatLng(ap.latitude, ap.longitude),
						map: map,
						icon: icon,
					});

					this.appendElementToList(ap)

				}
				console.log(this.airports)
			})
			.catch(console.error);
	},

	initForm: function () {
		form.addEventListener('submit', event => {
			event.preventDefault();
			console.log(event)

			let idInput = document.getElementById("inputId").value
			let nameInput = document.getElementById("name").value
			let longInput = document.getElementById("long").value
			let latInput = document.getElementById("lat").value

			let requestbody = {
				name: nameInput,
				longitude: longInput,
				latitude: latInput
			}
			let requestMethod = ''

			if (idInput != "") {

				// modifier
				requestbody.id = idInput
				requestMethod = 'PUT'

			} else {

				// ajouter
				requestMethod = 'POST'

			}

			fetch(this.AVIATION_API_URL, {
				method: requestMethod,
				mode: "cors",
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(requestbody)
			})
				.then(response => {

					console.log(response)

					form.reset()
					form.parentElement.classList.remove('active')
					form.parentElement.style.display = 'none'

				})
		})
	},

	appendElementToList: function (airport) {
		const li = document.createElement('li')

		const linkEdit = document.createElement('a')
		linkEdit.setAttribute('data-id', airport.id);
		linkEdit.innerHTML = " modifier"

		const linkDelete = document.createElement('a')
		linkDelete.setAttribute('data-id', airport.id);
		linkDelete.innerHTML = " supprimer"

		li.innerHTML = '<span>' + airport.name + '</span>';
		li.appendChild(linkEdit)
		li.appendChild(linkDelete)
		const span = li.firstChild

		const ul = document.getElementById("airports-list")
		ul.appendChild(li);
		span.addEventListener('click', () => this.zoomMap(parseFloat(airport.longitude), parseFloat(airport.latitude)))


		linkEdit.addEventListener('click', e => {
			const form = document.getElementById('form')
			const formContainer = document.getElementById("formContainer")

			const input = document.getElementById("inputId")
			input.value = e.target.dataset.id

			formContainer.classList.add('active')
			formContainer.style.display = 'block'
		})

		linkDelete.addEventListener('click', e => {
			const requestbody = {
				id: e.target.dataset.id
			}

			fetch(this.AVIATION_API_URL, {
				method: 'DELETE',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify(requestbody)
			})
				.then(response => {
					console.log(response)
					form.reset()
					form.parentElement.classList.remove('active')
					form.parentElement.style.display = 'none'

					window.location.reload();
				})

		})

		const contentString =
						'<div id="content">' +
						'<div id="siteNotice">' +
						"</div>" +
						'<h1 id="firstHeading" class="firstHeading">' + airport.name + '</h1>' +
						'<div id="bodyContent">' +
						"<p></p>" +
						"</div>" +
						"</div>";

		const infowindow = new google.maps.InfoWindow({
			content: contentString,
		});

		const marker = new google.maps.Marker({
			position: new google.maps.LatLng(airport.latitude, airport.longitude),
			map,
		});

		marker.addListener("click", () => {
			infowindow.open({
				map,
				shouldFocus: false,
			});
		});
	},

	zoomMap: function (long, lat) {
		map.setCenter({ lat: lat, lng: long })
		map.setZoom(13)
	},

	toggleForm: function (map) {
		const form = document.getElementById("formContainer")
		if (form.className == "active") {
			form.style.display = "block"
		}
		else {
			form.style.display = "none"
		}
		map.addListener('dblclick', event => {
			console.log(event.latLng.lat(), event.latLng.lng())


			form.classList.toggle("active")
			if (form.className == "active") {
				form.style.display = "block"
			}
			else {
				form.style.display = "none"
			}
		})
	},
}