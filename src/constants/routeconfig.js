module.exports = {
	"routes": [
		{
			"sourceRoute": "/interface/v1/todo/bookmark/read",
			"type": "GET",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "todo",
					"packageName": "shiksha-todo"
				}
			]
		},
		{
			"sourceRoute": "/interface/v1/todo/bookmark/create",
			"type": "POST",
			"priority": "MUST_HAVE",
			"inSequence": false,
			"orchestrated": false,
			"targetPackages": [
				{
					"basePackageName": "todo",
					"packageName": "shiksha-todo"
				}
			]
		}
	]
}
