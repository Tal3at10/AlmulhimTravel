$json = Get-Content rag_test_results.json -Raw | ConvertFrom-Json
$md = "# RAG Local Test Results (Last 40 Messages)`n`n"
foreach ($item in $json) {
    $md += "### Message: " + $item.message + "`n`n**Found Context:**`n"
    foreach ($rag in $item.ragFound) {
        $md += "- " + $rag + "`n"
    }
    $md += "`n---`n"
}
$md | Out-File -Encoding utf8 rag_test_results_formatted.md
