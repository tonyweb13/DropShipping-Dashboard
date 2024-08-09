<h1>{{ $details['heading'] }}</h1>
@if(!empty($details['checkin']))
<p><strong>Check-In: </strong>{{ $details['checkin'] }}</p>
@endif
@if(!empty($details['title']))
<p><strong>Title: </strong>{{ $details['title'] }}</p>
@endif
@if(!empty($details['sku']))
<p><strong>Sku: </strong>{{ $details['sku'] }}</p>
@endif
@if(!empty($details['count']))
<p><strong>Count: </strong>{{ $details['count'] }}</p>
@endif
@if(!empty($details['status']))
<p><strong>Status: </strong>{{ $details['status'] }}</p>
@endif
@if(!empty($details['notes']))
<p><strong>Notes: </strong>{{ $details['notes'] }}</p>
@endif