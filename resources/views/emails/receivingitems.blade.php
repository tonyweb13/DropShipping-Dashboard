<h1>{{ $details['heading'] }}</h1>
<p>Items updated to <strong>{{ $details['status'] }}</strong> are listed below.</p><br>
@if($details['receivingitems'])
	@foreach ($details['receivingitems'] as $receivingitem)
	    <p><strong>Check-In: </strong>{{ $receivingitem['checkin'] }}</p>
	    <p><strong>Title: </strong>{{ $receivingitem['title'] }}</p>
	    <p><strong>Sku: </strong>{{ $receivingitem['sku'] }}</p>
	    <p><strong>Count: </strong>{{ $receivingitem['count'] }}</p>
	    <hr>
	@endforeach
@endif