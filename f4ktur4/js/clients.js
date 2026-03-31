// Load all clients from Firebase
function loadClients() {
    database.ref("about_client").once("value").then(function(snapshot) {
        var clients = [];
        snapshot.forEach(function(child) {
            clients.push({ key: child.key, ...child.val() });
        });
        // Sort: non-archived first, then alphabetically
        clients.sort(function(a, b) {
            if (a.archived !== b.archived) return a.archived ? 1 : -1;
            return (a.client_name_id || '').localeCompare(b.client_name_id || '', 'cs');
        });
        renderClients(clients);
    }).catch(function(error) {
        console.error('Failed to load clients:', error);
        alert('Nepodařilo se načíst klienty: ' + error.message);
    });
}

// Initial load
$(document).ready(function() {
    loadClients();
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
        var isArchived = client.archived === true;

        // Build info line: street, city, IČ, DIČ
        var infoParts = [];
        if (client.client_address_street) {
            infoParts.push(client.client_address_street);
        }
        if (client.client_address_town) {
            infoParts.push(client.client_address_town);
        }
        if (client.client_legal_id) {
            infoParts.push('IČ ' + client.client_legal_id);
        }
        if (client.client_tax_id) {
            infoParts.push('DIČ CZ' + client.client_tax_id);
        }
        var infoLine = infoParts.join(', ');

        var html = '<div class="client-item' + (isArchived ? ' archived' : '') + '" data-key="' + client.key + '">' +
            '<div class="item-header">' + (client.client_name_id || 'Bez názvu') + '</div>' +
            '<div class="item-row">' +
                '<div class="item-info">' + infoLine + '</div>' +
                '<div class="item-actions">';

        if (isArchived) {
            html += '<button class="action-btn reactivate" data-key="' + client.key + '">Obnovit</button>';
        } else {
            html += '<a href="client_info.html?edit=' + client.key + '" class="action-link edit">Upravit</a>' +
                    '<button class="action-btn archive" data-key="' + client.key + '">Archivovat</button>';
        }

        html += '</div></div></div>';

        container.append(html);
    });
}

// Archive client
$(document).on('click', '.archive', function() {
    var key = $(this).data('key');
    var item = $(this).closest('.client-item');
    var clientName = item.find('.item-header').text();

    if (confirm('Archivovat klienta ' + clientName + '?')) {
        database.ref("about_client/" + key).update({archived: true}).then(function() {
            loadClients(); // Reload list
        }).catch(function(error) {
            alert('Chyba: ' + error.message);
        });
    }
});

// Reactivate client
$(document).on('click', '.reactivate', function() {
    var key = $(this).data('key');

    database.ref("about_client/" + key).update({archived: false}).then(function() {
        loadClients(); // Reload list
    }).catch(function(error) {
        alert('Chyba: ' + error.message);
    });
});
