// Load all clients from Firebase
var clientsRef = firebase.database().ref("about_client");

clientsRef.on('value', function(snapshot) {
    var clients = [];

    snapshot.forEach(function(childSnapshot) {
        clients.push({
            key: childSnapshot.key,
            data: childSnapshot.val()
        });
    });

    // Sort: active first, then by name
    clients.sort(function(a, b) {
        // Archived at the end
        if (a.data.archived !== b.data.archived) {
            return a.data.archived ? 1 : -1;
        }
        // Then alphabetically by name
        return (a.data.client_name_id || '').localeCompare(b.data.client_name_id || '');
    });

    renderClients(clients);
});

function renderClients(clients) {
    var container = $('#clientsList');
    var emptyMessage = $('#emptyMessage');

    container.empty();

    if (clients.length === 0) {
        emptyMessage.removeClass('hidden');
        return;
    }

    emptyMessage.addClass('hidden');

    clients.forEach(function(client) {
        var data = client.data;
        var isArchived = data.archived === true;
        var address = [data.client_address_street, data.client_address_town, data.client_address_zip]
            .filter(Boolean).join(', ');

        var html = '<div class="client-item' + (isArchived ? ' archived' : '') + '" data-key="' + client.key + '">' +
            '<div class="client-main">' +
                '<div class="client-name">' + (data.client_name_id || 'Bez nazvu') + '</div>' +
                '<div class="client-info-row">' +
                    'IC ' + (data.client_legal_id || '-') +
                    (data.client_tax_id ? ', DIC CZ' + data.client_tax_id : '') +
                '</div>' +
                '<div class="client-info-row">' + address + '</div>' +
            '</div>' +
            '<div class="client-actions">';

        if (isArchived) {
            html += '<button class="action-btn reactivate" data-key="' + client.key + '">Obnovit</button>';
        } else {
            html += '<a href="client_info.html?edit=' + client.key + '" class="action-link edit">Upravit</a>' +
                    '<button class="action-btn archive" data-key="' + client.key + '">Archivovat</button>';
        }

        html += '</div></div>';

        container.append(html);
    });
}

// Archive client
$(document).on('click', '.archive', function() {
    var key = $(this).data('key');
    var item = $(this).closest('.client-item');
    var clientName = item.find('.client-name').text();

    if (confirm('Archivovat klienta ' + clientName + '?')) {
        firebase.database().ref("about_client").child(key).update({ archived: true })
            .catch(function(error) {
                alert('Chyba: ' + error.message);
            });
    }
});

// Reactivate client
$(document).on('click', '.reactivate', function() {
    var key = $(this).data('key');

    firebase.database().ref("about_client").child(key).update({ archived: false })
        .catch(function(error) {
            alert('Chyba: ' + error.message);
        });
});
