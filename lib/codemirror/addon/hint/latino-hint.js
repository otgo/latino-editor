/*
** The MIT License (MIT)
** Copyright (c) Latino - Lenguaje de Programacion
** Permission is hereby granted, free of charge, to any person obtaining a copy
** of this software and associated documentation files (the "Software"), to deal
** in the Software without restriction, including without limitation the rights
** to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
** copies of the Software, and to permit persons to whom the Software is
** furnished to do so, subject to the following conditions:
** The above copyright notice and this permission notice shall be included in
** all copies or substantial portions of the Software.
** THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
** IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
** FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
** AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
** LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
** OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
** THE SOFTWARE.
**/

(function(mod) {
    if (typeof exports == "object" && typeof module == "object")
    mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd)
    define(["../../lib/codemirror"], mod);
    else
    mod(CodeMirror);
})(function(CodeMirror) {
    var Pos = CodeMirror.Pos;

    function forEach(arr, f) {
        for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
    }

    function arrayContains(arr, item) {
        if (!Array.prototype.indexOf) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === item) {
                    return true;
                }
            }
            return false;
        }
        return arr.indexOf(item) != -1;
    }

    function scriptHint(editor, keywords, getToken, options) {
        var cur = editor.getCursor(), token = getToken(editor, cur);
        if (/\b(?:string|comment)\b/.test(token.type)) return;
        token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;

        if (!/^[\w$_]*$/.test(token.string)) {
            token = {start: cur.ch, end: cur.ch, string: "", state: token.state,
            type: token.string == "." ? "property" : null};
        } else if (token.end > cur.ch) {
            token.end = cur.ch;
            token.string = token.string.slice(0, cur.ch - token.start);
        }

        var tprop = token;

        while (tprop.type == "property") {
            tprop = getToken(editor, Pos(cur.line, tprop.start));
            if (tprop.string != ".") return;
            tprop = getToken(editor, Pos(cur.line, tprop.start));
            if (!context) var context = [];
            context.push(tprop);
        }
        return {list: getCompletions(token, context, keywords, options),
            from: Pos(cur.line, token.start),
            to: Pos(cur.line, token.end)};
        }

        function latinoHint(editor, options) {
            return scriptHint(editor, latinoKeywords,
                function (e, cur) {return e.getTokenAt(cur);},
                options);
            };
            CodeMirror.registerHelper("hint", "latino", latinoHint);

            var latinoKeywords = ("escribir()|imprimir()|acadena()|anumero()|alogico()|incluir()|leer()|limpiar()|tipo()|imprimirf()|error()|poner()|mostrar()|imprimir_pila()"
            + "|dic.longitud()|dic.llaves()|dic.valores()|dic.vals()"
            + "|archivo.leer()|archivo.lineas()|archivo.ejecutar()|archivo.poner()|archivo.copiar()|archivo.eliminar()|archivo.crear()|archivo.renombrar()"
            + "|lista.invertir()|lista.agregar()|lista.extender()|lista.eliminar_indice()|lista.longitud()|lista.indice()|lista.encontrar()|lista.comparar()|lista.insertar()|lista.eliminar()|lista.contiene()|lista.concatenar()|lista.crear()"
            + "|mate.acos()|mate.atan()|mate.cosh()|mate.senh()|mate.tanh()|mate.log()|mate.raiz()|mate.piso()|mate.atan2()|mate.frexp()|mate.aleatorio()|mate.asen()|mate.cos()|mate.sen()|mate.tan()|mate.exp()|mate.log10()|mate.techo()|mate.abs()|mate.pot()|mate.ldexp()"
            + "|paquete.cargar()|cadena.char()|cadena.bytes()|cadena.esta_vacia()|cadena.longitud()|cadena.minusculas()|cadena.mayusculas()|cadena.recortar()|cadena.es_numerico()|cadena.es_numero()|cadena.es_alfa()|cadena.invertir()|cadena.ejecutar()|cadena.concatenar()|cadena.comparar()|cadena.contiene()|cadena.termina_con()"
            + "|cadena.es_igual()|cadena.indice()|cadena.encontrar()|cadena.ultimo_indice()|cadena.eliminar()|cadena.separar()|cadena.inicia_con()|cadena.match()|cadena.insertar()|cadena.rellenar_izquierda()|cadena.rellenar_derecha()|cadena.reemplazar()|cadena.subcadena()|cadena.formato()"
            + "|sis.dormir()|sis.ejecutar()|sis.pipe()|sis.fecha()|sis.salir()|sis.avisar()|sis.cwd()|sis.iraxy()|sis.tiempo()|sis.usuario()|cierto|elegir ()\n\t\nfin|otro:\n\t|verdadero|defecto:\n\t|caso '':|falso|nulo|desde ( ; ; )|hasta ()|osi ()|sino\n\t|fin|repetir\n\t|romper"
            + "|mientras ()|si ()|funcion |fun |global |regresar |retornar |ret ").split("|");

            function forAllProps(obj, callback) {
                if (!Object.getOwnPropertyNames || !Object.getPrototypeOf) {
                    for (var name in obj) callback(name)
                } else {
                    for (var o = obj; o; o = Object.getPrototypeOf(o))
                    Object.getOwnPropertyNames(o).forEach(callback)
                }
            }

            function getCompletions(token, context, keywords, options) {
                var found = [], start = token.string, global = options && options.globalScope || window;
                function maybeAdd(str) {
                    if (str.lastIndexOf(start, 0) == 0 && !arrayContains(found, str)) found.push(str);
                }
                if (context && context.length) {

                    var obj = context.pop(), base;
                    if (obj.type && obj.type.indexOf("variable") === 0) {
                        if (options && options.additionalContext)
                        base = options.additionalContext[obj.string];
                        if (!options || options.useGlobalScope !== false)
                        base = base || global[obj.string];
                    } else if (obj.type == "string") {
                        base = "";
                    } else if (obj.type == "atom") {
                        base = 1;
                    } else if (obj.type == "function") {
                        if (global.jQuery != null && (obj.string == '$' || obj.string == 'jQuery') &&
                        (typeof global.jQuery == 'function'))
                        base = global.jQuery();
                        else if (global._ != null && (obj.string == '_') && (typeof global._ == 'function'))
                        base = global._();
                    }
                    while (base != null && context.length)
                    base = base[context.pop().string];
                } else {
                    for (var v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
                    for (var v = token.state.globalVars; v; v = v.next) maybeAdd(v.name);
                    if (!options || options.useGlobalScope !== false)
                    forEach(keywords, maybeAdd);
                }
                return found;
            }
        });
