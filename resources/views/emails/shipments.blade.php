<h1>{{ $details['heading'] }}</h1>
@if(!empty($details['shipment_title']))
<p><strong>SHIPMENT TITLE: </strong>{{ $details['shipment_title'] }}</p>
@endif
@if(!empty($details['title']))
<p><strong>ITEM TITLE: </strong>{{ $details['title'] }}</p>
@endif
@if(!empty($details['qty']))
<p><strong>EXPECTED QTY: </strong>{{ $details['qty'] }}</p>
@endif
@if(!empty($details['sku']))
<p><strong>ITEM SKU: </strong>{{ $details['sku'] }}</p>
@endif
@if(!empty($details['country']))
<p><strong>SHIPPING COUNTRY: </strong>{{ $details['country'] }}</p>
@endif
@if(!empty($details['contact_person']))
<p><strong>CONTACT PERSON: </strong>{{ $details['contact_person'] }}</p>
@endif
@if(!empty($details['contact_number']))
<p><strong>CONTACT NUMBER: </strong>{{ $details['contact_number'] }}</p>
@endif
@if(!empty($details['notes']))
<p><strong>NOTES: </strong>{{ $details['notes'] }}</p>
@endif
@if(!empty($details['status']))
<p><strong>STATUS: </strong>{{ $details['status'] }}</p>
@endif