function recalc_onclick(e) {
	co.pA1B = $("#pA1B").val();
	co.pA2B = eeparseFloat($("#pA2B").val());
	co.pA2C = $("#pA2C").val();
	co.pA3B = eeparseFloat($("#pA3B").val());
	co.pA3C = $("#pA3C").val();
	co.pA4B = eeparseFloatV($("#pA4B").val());
	co.pA5B = $("#pA5B").val();
	co.pA6G = eeparseFloat($("#pA6G").val());
	co.pA6H = $("#pA6H").val();
	co.pA6M = eeparseFloat($("#pA6M").val());
	co.pA6N = $("#pA6N").val();
	calc(co);
	$("#pA2D").val(eedisplayFloat(co.pA2D));
	$("#pA3D").val(eedisplayFloat(co.pA3D));
	$("#pA6B").val(eedisplayFloatND(co.pA6B, 2));
	$("#pA6J").val(eedisplayFloat(co.pA6J));
	$("#pA6O").val(eedisplayFloat(co.pA6O));
	$("#pA7B").val(eedisplayFloatND(co.pA7B, 2));
	$("#pA7F").val(eedisplayFloatND(co.pA7F, 2));
	$("#pA7L").val(eedisplayFloatND(co.pA7L, 2));
	$("#pA8B").val(eedisplayFloatND(co.pA8B, 2));
	$("#pA8D").val(eedisplayFloatND(co.pA8D, 2));
	$("#pA8F").val(eedisplayFloatND(co.pA8F, 2));
	$("#pA8H").val(eedisplayFloatND(co.pA8H, 2));
	$("#pA8L").val(eedisplayFloatND(co.pA8L, 2));
	$("#pA8N").val(eedisplayFloatND(co.pA8N, 2));
	$("#pA9B").val(eedisplayFloatND(co.pA9B, 2));
	$("#pA9D").val(eedisplayFloatND(co.pA9D, 2));
	$("#pA9F").val(eedisplayFloatND(co.pA9F, 2));
	$("#pA9H").val(eedisplayFloatND(co.pA9H, 2));
	$("#pA9L").val(eedisplayFloatND(co.pA9L, 2));
	$("#pA9N").val(eedisplayFloatND(co.pA9N, 2));
	$("#pA10B").val(eedisplayFloatND(co.pA10B, 2));
	$("#pA10D").val(eedisplayFloatND(co.pA10D, 2));
	$("#pA10F").val(eedisplayFloatND(co.pA10F, 2));
	$("#pA10H").val(eedisplayFloatND(co.pA10H, 2));
	$("#pA10L").val(eedisplayFloatND(co.pA10L, 2));
	$("#pA10N").val(eedisplayFloatND(co.pA10N, 2))
}
function calc(e) {
	var t = e.pA1B;
	var n = e.pA2B;
	var r = e.pA2C;
	var i = e.pA3B;
	var s = e.pA3C;
	var o = e.pA4B;
	var u = e.pA5B;
	var a = e.pA6G;
	var f = e.pA6H;
	var l = e.pA6M;
	var c = e.pA6N;
	var h = "Sedentary (little or no exercise, desk job)";
	var p = "Lightly active (light exercise/sports 1-3 days/wk)";
	var d = "Moderately active (moderate exercise/sports 3-5 days/wk)";
	var v = "Very active (hard exercise/sports 6-7 days/wk)";
	var m = "Extremely active (hard daily exercise/sports & physical job)";
	var g = str_eq(r, "centimetres") ? n : n * 2.54;
	var y = str_eq(s, "kilograms") ? i : i * .4536;
	var b = str_eq(t, "Male") ? 66 + 13.7 * y + 5 * g - 6.8 * v2n(o) : 655 + 9.6 * y + 1.8 * g - 4.7 * v2n(o);
	var w = str_eq(f, "pounds") ? a : a * 2.2;
	var E = str_eq(c, "pounds") ? l : l * 2.2;
	var S = str_eq(u, h) ? b * 1.2 : str_eq(u, p) ? b * 1.375 : str_eq(u, d) ? b * 1.55 : str_eq(u, v) ? b * 1.725 : str_eq(u, m) ? b * 1.9 : 0;
	var x = S - 500 * w;
	var T = S + 500 * E;
	var N = S * .55;
	var C = S * .15;
	var k = S * .3;
	var L = N * .25;
	var A = x * .55;
	var O = T * .55;
	var M = C * .25;
	var _ = x * .15;
	var D = T * .15;
	var P = k * .1111;
	var H = x * .3;
	var B = T * .3;
	var j = A * .25;
	var F = O * .25;
	var I = _ * .25;
	var q = D * .25;
	var R = H * .1111;
	var U = B * .1111;
	e.pA2D = g;
	e.pA3D = y;
	e.pA6B = b;
	e.pA6J = w;
	e.pA6O = E;
	e.pA7B = S;
	e.pA7F = x;
	e.pA7L = T;
	e.pA8B = N;
	e.pA8D = L;
	e.pA8F = A;
	e.pA8H = j;
	e.pA8L = O;
	e.pA8N = F;
	e.pA9B = C;
	e.pA9D = M;
	e.pA9F = _;
	e.pA9H = I;
	e.pA9L = D;
	e.pA9N = q;
	e.pA10B = k;
	e.pA10D = P;
	e.pA10F = H;
	e.pA10H = R;
	e.pA10L = B;
	e.pA10N = U
}
function str_eq(e, t) {
	if (!e || !t) {
		return
	}
	return e.toLowerCase() == t.toLowerCase()
}
function myIsNaN(e) {
	return isNaN(e) || typeof e == "number" && !isFinite(e)
}
function round(e, t) {
	if (isFinite(e) && isFinite(t)) {
		var n = e < 0 ? -1 : 1;
		var r = Math.abs(e);
		var i = Math.pow(10, t);
		return n * Math.round(r * i) / i
	} else {
		return NaN
	}
}
function s2n(e) {
	e = String(e).replace(eedecreg, ".");
	return parseFloat(e)
}
function v2n(e) {
	switch (typeof e) {
	case "number":
		return e;
	case "string":
		return s2n(e);
	case "boolean":
		return e ? 1 : 0;
	case "object":
		if (e.constructor == Number) {
			return e
		}
		if (e.constructor == String) {
			return s2n(e)
		}
		if (e.constructor == Boolean) {
			return e ? 1 : 0
		}
		return Number.NaN;
	default:
		return Number.NaN
	}
}
function eeparseFloat(e) {
	e = String(e).replace(eedecreg, ".");
	var t = parseFloat(e);
	if (isNaN(t)) {
		return 0
	} else {
		return t
	}
}
function eedisplayFloat(e) {
	if (myIsNaN(e)) {
		return Number.NaN
	} else {
		return String(e).replace(/\./g, eedec)
	}
}
function eedisplayFloatND(e, t) {
	if (myIsNaN(e)) {
		return Number.NaN
	} else {
		var n = round(e, t);
		if (t > 0) {
			var r = String(n);
			if (r.indexOf("e") != -1)
				return r;
			if (r.indexOf("E") != -1)
				return r;
			var i = r.split(".");
			if (i.length < 2) {
				var s = "00000000000000".substring(0, t);
				return i[0].toString() + eedec + s
			} else {
				var s = (i[1].toString() + "00000000000000").substring(0, t);
				return i[0].toString() + eedec + s
			}
		} else {
			return n
		}
	}
}
function eeparseFloatV(e) {
	if (e == "")
		return e;
	e = String(e).replace(eedecreg, ".");
	if (!eeparseFloatVreg.test(e)) {
		return e
	}
	var t = parseFloat(e);
	if (isNaN(t)) {
		return e
	} else {
		return t
	}
}
var co = [];
var eeisus = 1;
var eetrue = "TRUE";
var eefalse = "FALSE";
var eedec = ".";
var eeth = ",";
var eedecreg = new RegExp("[.]", "g");
var eethreg = new RegExp(",", "g");
var eeparseFloatVreg = new RegExp("^ *-?[0-9.]+ *$");