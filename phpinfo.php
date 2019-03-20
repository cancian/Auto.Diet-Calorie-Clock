<?php phpinfo(); ?>

<?php
exec('free -mo', $out);
preg_match_all('/\s+([0-9]+)/', $out[1], $matches);
list($total, $used, $free, $shared, $buffers, $cached) = $matches[1];
echo "Memory: " . $used . "/" . $total;
?>

