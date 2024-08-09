<h1>{{ $details['heading'] }}</h1>
<p>{{ $details['message'] }}</p>
@if(!empty($details['first_name']))
<p><strong>First Name: </strong>{{ $details['first_name'] }}</p>
@endif
@if(!empty($details['last_name']))
<p><strong>Last Name: </strong>{{ $details['last_name'] }}</p>
@endif
@if(!empty($details['address']))
<p><strong>Address: </strong>{{ $details['address'] }}</p>
@endif
@if(!empty($details['address2']))
<p><strong>Address 2: </strong>{{ $details['address2'] }}</p>
@endif
@if(!empty($details['address3']))
<p><strong>Address 3: </strong>{{ $details['address3'] }}</p>
@endif
@if(!empty($details['city']))
<p><strong>City: </strong>{{ $details['city'] }}</p>
@endif
@if(!empty($details['state']))
<p><strong>State: </strong>{{ $details['state'] }}</p>
@endif
@if(!empty($details['postal_code']))
<p><strong>Zip Code: </strong>{{ $details['postal_code'] }}</p>
@endif
@if(!empty($details['shipping_country']))
<p><strong>Country: </strong>{{ $details['shipping_country'] }}</p>
@endif