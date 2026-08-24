$content = Get-Content -Path 'E:\Projects\AlMulhim-Travel\backend\src\Infrastructure.Shared\Services\RapidApiHotelService.cs' -Raw
$header = $content.Substring(0, $content.IndexOf('public class RapidApiHotelService'))

function ExtractRegion($name) {
    $pattern = '(?s)[ \t]*#region ' + [regex]::Escape($name) + '\r?\n(.*?)\r?\n[ \t]*#endregion'
    $match = [regex]::Match($content, $pattern)
    if ($match.Success) {
        $body = $match.Groups[1].Value
        $fileName = 'RapidApiHotelService.' + $name.Replace(' ', '').Replace('.', '') + '.cs'
        $newFileContent = $header + 'public partial class RapidApiHotelService' + "
{" + "
" + $body + "
}
"
        Set-Content -Path ('E:\Projects\AlMulhim-Travel\backend\src\Infrastructure.Shared\Services\' + $fileName) -Value $newFileContent
        $script:content = $script:content.Replace($match.Value, '')
    }
}

ExtractRegion 'Booking.com'
ExtractRegion 'Tripadvisor'
ExtractRegion 'Hotels.com'
ExtractRegion 'Priceline'
ExtractRegion 'Combined Search'

$script:content = $script:content.Replace('public class RapidApiHotelService : IRapidApiHotelService', 'public partial class RapidApiHotelService : IRapidApiHotelService')
Set-Content -Path 'E:\Projects\AlMulhim-Travel\backend\src\Infrastructure.Shared\Services\RapidApiHotelService.cs' -Value $script:content
