$data = Get-Content e:\Projects\AlMulhim-Travel\backend\convs_utf8.json -Raw | ConvertFrom-Json
# First, let's group by FreshchatId + ConvId combinations, since our dump has a row for EVERY MESSAGE.
# If a FreshchatId maps to multiple DISTINCT ConvId, it means duplicate conversations in DB!
$data | Group-Object FreshchatId | ForEach-Object {
    $uniqueConvIds = $_.Group | Select-Object -ExpandProperty ConvId -Unique
    if ($uniqueConvIds.Count -gt 1) {
        [PSCustomObject]@{
            FreshchatId = $_.Name
            CustomerName = $_.Group[0].Name
            ConvCount = $uniqueConvIds.Count
            ConvIds = $uniqueConvIds -join ", "
        }
    }
} | Format-Table -AutoSize
