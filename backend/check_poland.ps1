$data = Get-Content e:\Projects\AlMulhim-Travel\backend\convs_utf8.json -Raw | ConvertFrom-Json
$polandRussiaConvs = $data | Where-Object { $_.Content -match 'بولندا' -or $_.Content -match 'روسيا' } | Select-Object -ExpandProperty ConvId -Unique
$polandRussiaConvs
