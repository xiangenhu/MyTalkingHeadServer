window.Angela_Dir = {
	"width":250, "height":200, "presenting":false, "fps":12, "version":"5.4.7.0", "project":"Angela", "allowautoplay":"detect", "variables":"c.Text=\"\";", "htmlrss":"true", "htmlpersist":"true",
	"items":{
		"Scene1":{
			"type":"scene", "name":"Scene 1",
			"items":{
				"Char1":{"type":"character", "name":"Angela", "left":0, "top":0, "width":250, "height":200, "artwidth":250, "artheight":200, "mode":"replace"},
				"MsgChar1Idle":{
					"type":"message", "idle":true, "character":"Char1", "frames":16,
					"onframe":{
						"0":"c.load('Img1','A727B9E0DDD9DCC682B12E50B35F93B3.png',237,106,106,1);c.load('Img2','C28CB619154D539FD166CC00D8CC487D.png',190,200,200,1);",
						"1":"c.add('Img1',6,94,1,31,0,190,200);c.add('Img2',31,0,1);",
						"6":"c.rec(16);",
						"9":"c.rec(16);",
						"11":"c.branch(1);",
						"14":"c.stop()",
						"16":"c.add('Img1',6,94,1,31,0,190,200);c.add('Img2',31,0,1);c.stop()"
					}
				},
				"Msg1":{"type":"message", "name":"Speak", "external":true, "url":"http://localhost/cs/cs.exe?template=Library%2FTemplates%2FServer%2FSpeech.xml&character=AngelaHead&addons=&voice=Neo%20Julie&size=250,200&autoactionlevel=2&customtop=classictop&customhair=combeddark&flashversion=11&actionscript=3", "method":"get", "addvariables":"Text", "character":"Char1"}
			}
		}
	}
};
msDocLoaded();