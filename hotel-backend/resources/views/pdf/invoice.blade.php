<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Facture - Réservation #{{ $reservation->id }}</title>
  <style>
    body {
      font-family: DejaVu Sans, sans-serif;
      margin: 40px;
      color: #222;
    }

    header {
      margin-bottom: 40px;
      border-bottom: 2px solid #444;
      padding-bottom: 10px;
    }

    header h1 {
      font-size: 24px;
      margin: 0;
    }

    .section {
      margin-bottom: 25px;
    }

    .section h2 {
      font-size: 18px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4px;
    }

    .info p {
      margin: 5px 0;
    }

    .label {
      font-weight: bold;
    }

    .total {
      font-size: 20px;
      font-weight: bold;
      margin-top: 30px;
    }

    footer {
      margin-top: 50px;
      font-style: italic;
      font-size: 14px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>

  <header>
    <h1>Facture - Réservation #{{ $reservation->id }}</h1>
  </header>

  <div class="section">
    <h2>Détails du client</h2>
    <p><span class="label">Nom :</span> {{ $reservation->client->firstName }} {{ $reservation->client->lastName }}</p>
    <p><span class="label">Email :</span> {{ $reservation->client->email }}</p>
    <p><span class="label">Téléphone :</span> {{ $reservation->client->phone }}</p>
    <p><span class="label">Document :</span> {{ $reservation->client->documentType }} - {{ $reservation->client->document }}</p>
  </div>

  <div class="section">
    <h2>Détails de la réservation</h2>
    <p><span class="label">Chambre :</span> {{ $reservation->room->number }} ({{ $reservation->room->type }})</p>
    <p><span class="label">Capacité :</span> {{ $reservation->room->capacity }} personne(s)</p>
    <p><span class="label">Prix par nuit :</span> {{ number_format($reservation->room->price, 2) }} €</p>
    <p><span class="label">Date d'arrivée :</span> {{ $reservation->check_in_date }}</p>
    <p><span class="label">Date de départ :</span> {{ $reservation->check_out_date }}</p>
  </div>

  <div class="total">
    Montant total : {{ number_format($reservation->total_amount, 2) }} €
  </div>

  <footer>
    Merci pour votre réservation. Nous espérons vous revoir bientôt.
  </footer>

</body>
</html>
