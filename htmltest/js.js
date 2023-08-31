const data ={
    0:`
    <a href="https://timganez.vercel.app/">https://timganez.vercel.app/</a>
    <p>Welcome</p>
    `,
    1:`
                <div id="list1">
                    <h3>install Ubuntu on windows</h3>
                    <li>
                        search -> windows features -> windows Subsystem for Linux -> check
                    </li>
                    <li>
                        <label>Open powershell</label>
                        <div class="p-3">
<pre class="border p-3">
# download Ubuntu
-> Invoke-WebRequest -Uri https://aka.ms/wsl-ubuntu-1604 -OutFile Ubuntu.zip -UseBasicParsing

# extract the file
-> Expand-Archive ./Ubuntu.zip ./Ubuntu

# set path
-> $userenv = [System.Environment]::GetEnvironmentVariable("Path", "User")
-> [System.Environment]::SetEnvironmentVariable("PATH", $userenv + $(Get-Location).Path + "\Ubuntu", "User")

# install WSL:
-> Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
</pre>
                        </div>
                    </li>
                    <li>
                        <label>Open cmd</label>
                        <div class="class p-3">
<pre class="border p-3">
# open Ubuntu
-> cd Utuntu
-> start ubuntu1604.exe

#update
-> sudo apt-get update
-> sudo apt-get upgrade
</pre>                            
                        </div>
                    </li>
                    <center><label>https://keestalkstech.com/2019/04/installing-ubuntu-to-windows-server-2019-wsl/</label></center>
                </div>
    `,
    2:`
    <div>
        <h3>install Tor on Linux</h3>
        <li>
            <label>Open cmd</label>
            <div class="p-3">
<pre class="border p-3">
# get Ubuntu
-> wsl
-> cd ~
-> sudo add-apt-repository ppa:micahflee/ppa
-> sudo apt update

# Tor browser launcher
-> sudo apt install torbrowser-launcher 
</pre>
            </div>
        </li>
        <center><label>https://linuxhint.com/install-tor-browser-on-linux-mint-ubuntu/</label></center>
    </div>
    `,
    3:`
    <div>
        <h3>Hot to deploy html file on tor .onion</h3>
        <li><a class="underline" onclick="openAndClose(1)">install Ubuntu on windows</a></li>
        <li><a class="underline" onclick="openAndClose(2)">install tor on linux/Ubuntu</a></li>
        <li>
            <label>ขั้นตอนที่ 1</label>
            <div class="p-3">
<pre class="border p-3">
# get Ubuntu
-> wsl
-> cd /
-> cd ~
-> whereis tor
-> cd /etc/tor

# หาไฟล์ torrc -> ls เพื่อแสกนไฟล์
-> ls
-> sudo nano torrc
-> sudo

# หาบรรทัดตามรูป
<img src="./img/torrc.png">

--> ลบ # ออกทั้ง 2 บรรทัดที่วงสีแดงไว้
-> ctrl + x
</pre>
            </div>
        </li>
    <li>
    <label>ขั้นตอนที่ 2</label>
    <div class="p-3">
<pre class="border p-3">
# เปิดไฟล์เอาหน้าเว็บไปไว้ในนี้ไฟล์นี้ 
-> cd /
-> cd mkdir tor_server
-> cd tor_server

# รันเซิฟชั้นที่ 1
python3 -m http.server --bind 127.0.0.1 8080

#ห้ามกาออก!
</pre>
            </div>
    </li>
    <li>
    <label>ขั้นตอนที่ 3</label>
    <div class="p-3">
<pre class="border p-3">
# เปิด cmd เข้า Ubuntu อีกอัน 
-> cd /
-> cd ~
-> cd /etc/tor

# รันเซิฟชั้นที่ 2
-> sudo tor

#ห้ามกาออก!
</pre>
            </div>
    </li>
    <li>
    <label>ขั้นตอนสุดท้ายดู url ของเรา</label>
    <div class="p-3">
<pre class="border p-3">
# เปิด cmd เข้า Ubuntu อีกอัน 
-> cd /
-> cd ~
-> cd tor_server
-> sudo su

# ดู url
-> cd /var/lib/tor/hidden_service
-> ls

# จะได้ url.onion 
-> cat hostname
</pre>
            </div>
    </li>
    </div>
    `,
} 
document.getElementById('body-item')
    .innerHTML = data[0]
function openAndClose(id){
    document.getElementById('body-item')
    .innerHTML = data[id]
}