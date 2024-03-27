from flask import Flask,render_template,request,flash,redirect, jsonify,url_for
import urllib,json,requests
app = Flask(__name__)

def request_as_fox(url):
	headers={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64; rv:38.0) Gecko/20100101 Firefox/38.0"}
	return urllib.request.Request(url,None,headers)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/search")
def search():
    return render_template("search.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/package")
def package():
    keyword = request.args.get('q', default = "", type = str)
    url = f"https://api.amania.jp/package-search?q={keyword}"
    print(url)
    with urllib.request.urlopen(request_as_fox(url)) as response:
        data = response.read().decode("utf-8")
        temp = json.loads(data)       
        data = temp
        if len(data) == 0:
            return redirect("https://tc.amania.jp/404")
        if data[0]:
            data = data[0]
            package_name = data.get("Name", "-")
            package_icon = data.get("Icon", "https://tc.amania.jp/static/favicon.ico")
            package_section = data.get("Section", "-")
            package_author = data.get("Author", data.get("Maintainer", "-"))
            package_description = data.get("Description", "-")
            package_repotitory = data.get("repository-name","-")
            package_depends = data.get("Depends","-")
            package_screenshots = None
            package_header = "/static/img/bernar.png"
            package_tintcolor = "#6c757d"
            if data.get("Architecture"):
                if "iphoneos-arm" == data.get("Architecture"):
                    package_arhitecture = "Rootfull"
                elif "iphoneos-arm64" == data.get("Architecture"):
                    package_arhitecture = "Rootless"
                elif "iphoneos-arm64e" == data.get("Architecture"):
                    package_arhitecture = "RootHide"
                elif "trollstore" == data.get("Architecture"):
                    package_arhitecture = "TrollStore"
                elif "windows" == data.get("Architecture"):
                    package_arhitecture = "Windows"
                elif "darwin" == data.get("Architecture"):
                    package_arhitecture = "Darwin"
                else:
                    package_arhitecture = data.get("Architecture")
            if data.get("SileoDepiction"):
                with requests.get(data["SileoDepiction"]) as response:
                    res = json.loads(response.text)
                    package_header = res.get("headerImage","/static/bernar.png")
                    package_tintcolor = res.get("tintColor", "#6c757d")
                    for tab in res.get("tabs", []):
                        for view in tab.get("views", []):
                            if view.get("screenshots") != None:
                                package_screenshots = view.get("screenshots")
            if len(temp) > 1:
                data = temp
                package_versions = []
                for item in data:
                    pa = item["Architecture"]
                    if pa:
                        if "iphoneos-arm" == pa:
                            pa = "Rootfull"
                        elif "iphoneos-arm64" == pa:
                            pa = "Rootless"
                        elif "iphoneos-arm64e" == pa:
                            pa = "RootHide"
                        elif "trollstore" == pa:
                            pa = "TrollStore"
                        elif "windows" == pa:
                            pa = "Windows"
                        elif "darwin" == pa:
                            pa = "Darwin"
                    package_version = {
                        "version": item["Version"],
                        "architecture": pa,
                        "url": item["Filename"]
                    }
                    package_versions.append(package_version)
            else:
                package_versions = [{"version":data.get("Version") , "architecture":f"{package_arhitecture}", "url":data.get("Filename")}]
            if package_tintcolor == "":
                package_tintcolor = "#6c757d"
            package_versions.reverse()
            with urllib.request.urlopen(request_as_fox("https://api.amania.jp/random-tweak?count=10")) as response:
                data = response.read().decode("utf-8")
                temp = json.loads(data)
                othertweak = temp
            return render_template("package.html", 
                                tweakname=package_name, 
                                tweakicon=package_icon, 
                                tweaksection=package_section + " " + package_arhitecture, 
                                tweakauthor=package_author,
                                tweakdescription=package_description, 
                                package_repotitory=package_repotitory, 
                                package_screenshots=package_screenshots, 
                                tweakheader=package_header,
                                package_versions=package_versions,
                                othertweak=othertweak,
                                package_tintcolor=package_tintcolor)
        else:
            return redirect("https://repo.amania.jp/404"),404

@app.route("/License")
def lisence():
    return render_template("License.html")

@app.route("/CydiaIcon.png")
def CydiaIcon():
    return redirect("/static/CydiaIcon.png")

@app.route("/Release")
def Release():
    return redirect("/static/Release")

@app.route("/Packages")
def Packages():
    return redirect("/static/Packages")

@app.route("/favicon.ico")
def favicon():
    return redirect("/static/favicon.ico")

if __name__ == "__main__":
    app.run(port=3000)