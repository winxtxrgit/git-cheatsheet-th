# 🇹🇭 Git Cheat Sheet ภาษาไทย

> รวมคำสั่ง Git ที่ใช้จริงทุกวัน อธิบายเป็นภาษาไทยสั้น ๆ พร้อมวิธีแก้สถานการณ์ "พังแล้วทำไงดี" ที่เจอบ่อยที่สุด

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/winxtxrgit/git-cheatsheet-th/blob/main/CONTRIBUTING.md)
![ภาษา](https://img.shields.io/badge/ภาษา-ไทย-blue)

ถ้ามีประโยชน์ ฝากกด ⭐ ให้ด้วยนะครับ จะได้ส่งต่อถึงเพื่อน ๆ ที่เพิ่งเริ่มใช้ Git

---

## 📑 สารบัญ

- [ตั้งค่าครั้งแรก](#setup)
- [เริ่มต้น repository](#init)
- [ดูสถานะและประวัติ](#status)
- [บันทึกงาน (add / commit)](#commit)
- [Branch](#branch)
- [Merge และ Rebase](#merge)
- [ทำงานกับ Remote (GitHub)](#remote)
- [ย้อนกลับ / ยกเลิก](#undo)
- [Stash: พักงานไว้ก่อน](#stash)
- [Tag](#tag)
- [🚑 พังแล้วทำไงดี](#oops)
- [Workflow ส่ง Pull Request](#pr-workflow)
- [Alias ช่วยพิมพ์น้อยลง](#alias)
- [ศัพท์ที่ควรรู้](#glossary)
- [Cherry-pick: หยิบ commit มาใส่](#cherry-pick)

---

<a id="setup"></a>

## ⚙️ ตั้งค่าครั้งแรก

```bash
git config --global user.name "ชื่อของคุณ"
git config --global user.email "you@example.com"   # ควรตรงกับอีเมลใน GitHub
git config --global init.defaultBranch main         # ให้ repo ใหม่ใช้ main
git config --global core.editor "code --wait"       # ใช้ VS Code เป็น editor
git config --global pull.rebase false               # git pull แบบ merge (ค่าปกติ)
git config --list                                   # ดูค่าที่ตั้งไว้ทั้งหมด
```

<a id="init"></a>

## 📦 เริ่มต้น repository

| คำสั่ง | ทำอะไร |
| :--- | :--- |
| `git init` | สร้าง repo ใหม่ในโฟลเดอร์ปัจจุบัน |
| `git clone <url>` | ดาวน์โหลด repo จาก GitHub มาทั้งก้อน |
| `git clone <url> ชื่อโฟลเดอร์` | clone แล้วตั้งชื่อโฟลเดอร์เอง |
| `git clone --depth 1 <url>` | clone แค่ commit ล่าสุด (เร็ว เหมาะกับ repo ใหญ่) |

<a id="status"></a>

## 🔍 ดูสถานะและประวัติ

| คำสั่ง | ทำอะไร |
| :--- | :--- |
| `git status` | ไฟล์ไหนแก้ / ยังไม่ add / พร้อม commit |
| `git status -s` | แบบย่อ |
| `git diff` | ดูสิ่งที่แก้แต่ยังไม่ add |
| `git diff --staged` | ดูสิ่งที่ add แล้วแต่ยังไม่ commit |
| `git log --oneline --graph --all` | ดูประวัติเป็นกราฟสวย ๆ ทุก branch |
| `git log -p <ไฟล์>` | ดูว่าไฟล์นี้ถูกแก้อะไรบ้างในแต่ละ commit |
| `git show <commit>` | ดูรายละเอียด commit นั้น |
| `git blame <ไฟล์>` | ดูว่าแต่ละบรรทัดใครแก้ล่าสุด |

<a id="commit"></a>

## 💾 บันทึกงาน (add / commit)

```bash
git add ไฟล์.txt          # เลือกไฟล์เข้า staging
git add .                 # add ทุกไฟล์ในโฟลเดอร์ปัจจุบัน
git add -p                # เลือก add ทีละส่วน (hunk) ละเอียดมาก
git commit -m "ข้อความ"   # บันทึก commit
git commit -am "ข้อความ"  # add ไฟล์ที่ track อยู่แล้ว + commit ในคำสั่งเดียว
git commit --amend        # แก้ commit ล่าสุด (ข้อความหรือเพิ่มไฟล์)
```

💡 **เขียน commit message ให้ดี:** ใช้รูปแบบ [Conventional Commits](https://www.conventionalcommits.org/) เช่น `feat: เพิ่มหน้า login`, `fix: แก้ปุ่มกดไม่ได้บนมือถือ`, `docs: อัปเดต README`

<a id="branch"></a>

## 🌿 Branch

| คำสั่ง | ทำอะไร |
| :--- | :--- |
| `git branch` | ดู branch ในเครื่อง |
| `git branch -a` | ดูทุก branch รวม remote |
| `git switch <branch>` | สลับไป branch นั้น |
| `git switch -c <branch>` | สร้าง branch ใหม่แล้วสลับไปเลย |
| `git switch -` | กลับไป branch ก่อนหน้า |
| `git branch -m <ชื่อใหม่>` | เปลี่ยนชื่อ branch ปัจจุบัน |
| `git branch -d <branch>` | ลบ branch (ที่ merge แล้ว) |
| `git branch -D <branch>` | ลบ branch แบบบังคับ ⚠️ |

> `git checkout` ใช้แทน `switch` ได้ แต่ `switch` / `restore` เป็นคำสั่งรุ่นใหม่ที่แยกหน้าที่ชัดกว่า อ่านง่ายกว่า

<a id="merge"></a>

## 🔀 Merge และ Rebase

```bash
git switch main
git merge feature           # รวม feature เข้า main (มี merge commit)
git merge --squash feature  # รวมทุก commit เป็นก้อนเดียว แล้วค่อย commit เอง

git switch feature
git rebase main             # ย้าย commit ของ feature ไปต่อท้าย main (ประวัติเป็นเส้นตรง)
git rebase -i HEAD~3        # รวม/แก้/ลบ 3 commit ล่าสุด (interactive)
```

**เจอ conflict ทำยังไง**
1. เปิดไฟล์ที่ขึ้นว่า conflict แล้วแก้ส่วนที่อยู่ระหว่าง `<<<<<<<`, `=======`, `>>>>>>>`
2. `git add <ไฟล์>`
3. ถ้า merge อยู่ → `git commit` / ถ้า rebase อยู่ → `git rebase --continue`
4. อยากยกเลิกทั้งหมด → `git merge --abort` หรือ `git rebase --abort`

⚠️ **กฎทอง:** อย่า rebase branch ที่ push ขึ้นไปแล้วและมีคนอื่นใช้ร่วมด้วย

<a id="remote"></a>

## ☁️ ทำงานกับ Remote (GitHub)

| คำสั่ง | ทำอะไร |
| :--- | :--- |
| `git remote -v` | ดู remote ที่ผูกไว้ |
| `git remote add origin <url>` | ผูก repo ในเครื่องกับ GitHub |
| `git push -u origin <branch>` | push ครั้งแรก + จำ upstream ไว้ |
| `git push` | push ครั้งต่อ ๆ ไป |
| `git fetch` | ดึงข้อมูลล่าสุดมาดู แต่ยังไม่รวม |
| `git pull` | fetch + merge ในครั้งเดียว |
| `git pull --rebase` | fetch + rebase (ไม่เกิด merge commit) |
| `git push --force-with-lease` | force push แบบปลอดภัยกว่า `--force` |
| `git push origin --delete <branch>` | ลบ branch บน GitHub |

<a id="undo"></a>

## ⏪ ย้อนกลับ / ยกเลิก

| สถานการณ์ | คำสั่ง |
| :--- | :--- |
| ยกเลิกการแก้ไฟล์ (ยังไม่ add) | `git restore <ไฟล์>` |
| เอาไฟล์ออกจาก staging (add ไปแล้ว) | `git restore --staged <ไฟล์>` |
| ย้อน commit ล่าสุด แต่เก็บงานไว้ | `git reset --soft HEAD~1` |
| ย้อน commit ล่าสุด เก็บงานแต่ไม่ stage | `git reset HEAD~1` |
| ย้อนแล้วทิ้งงานทั้งหมด ⚠️ | `git reset --hard HEAD~1` |
| ย้อน commit ที่ push ไปแล้ว (ปลอดภัย) | `git revert <commit>` |
| ลบไฟล์ที่ไม่ได้ track ⚠️ | `git clean -n` (ดูก่อน) → `git clean -fd` |

> **reset vs revert:** `reset` = ลบ commit ออกจากประวัติ (ใช้กับงานที่ยังไม่ push) / `revert` = สร้าง commit ใหม่ที่หักล้างของเดิม (ใช้กับงานที่ push แล้ว)

<a id="stash"></a>

## 📥 Stash: พักงานไว้ก่อน

```bash
git stash                 # เก็บงานที่ยังไม่ commit ไว้ชั่วคราว
git stash -u              # รวมไฟล์ใหม่ที่ยังไม่ track ด้วย
git stash push -m "ชื่อ"  # ตั้งชื่อ stash
git stash list            # ดูรายการ
git stash pop             # เอากลับมา + ลบออกจาก stash
git stash apply stash@{1} # เอากลับมาแต่ไม่ลบ
git stash drop stash@{0}  # ลบ stash นั้น
```

<a id="tag"></a>

## 🏷️ Tag

```bash
git tag v1.0.0                      # tag แบบเบา
git tag -a v1.0.0 -m "ปล่อยเวอร์ชันแรก"  # tag แบบมีข้อความ (แนะนำ)
git push origin v1.0.0              # push tag เดียว
git push --tags                     # push ทุก tag
git tag -d v1.0.0                   # ลบ tag ในเครื่อง
```

---

<a id="oops"></a>

## 🚑 พังแล้วทำไงดี

<details>
<summary><b>พิมพ์ commit message ผิด (ยังไม่ push)</b></summary>

```bash
git commit --amend -m "ข้อความที่ถูกต้อง"
```
</details>

<details>
<summary><b>ลืม add ไฟล์ไปหนึ่งไฟล์ใน commit ล่าสุด</b></summary>

```bash
git add ไฟล์ที่ลืม
git commit --amend --no-edit
```
</details>

<details>
<summary><b>commit ลง main ไปแล้ว แต่ต้องการให้อยู่ branch ใหม่</b></summary>

```bash
git branch feature-ใหม่     # สร้าง branch ที่ชี้ไปยัง commit ปัจจุบัน
git reset --hard HEAD~1    # ถอย main กลับ 1 commit
git switch feature-ใหม่     # งานยังอยู่ครบที่นี่
```
</details>

<details>
<summary><b>commit ผิด branch (ต้องย้ายไป branch ที่มีอยู่แล้ว)</b></summary>

```bash
git log --oneline -1        # จด hash ของ commit ไว้
git reset --hard HEAD~1     # เอาออกจาก branch ผิด
git switch branch-ที่ถูก
git cherry-pick <hash>      # หยิบ commit มาใส่
```
</details>

<details>
<summary><b>reset --hard ไปแล้ว งานหาย! 😱</b></summary>

ใจเย็น ๆ Git จำทุกการเคลื่อนไหวของ HEAD ไว้ใน reflog (ประมาณ 90 วัน)

```bash
git reflog                  # หาบรรทัดก่อนที่จะพัง เช่น HEAD@{2}
git reset --hard HEAD@{2}   # กลับไปจุดนั้น
```
*ใช้ได้กับงานที่เคย commit แล้วเท่านั้น งานที่ไม่เคย commit หรือ stash จะกู้ไม่ได้*
</details>

<details>
<summary><b>เผลอ commit ไฟล์ลับ (.env / รหัสผ่าน / API key)</b></summary>

1. **เปลี่ยน key / รหัสผ่านทันที** ถือว่ารั่วไปแล้ว ถึงจะลบ commit ก็ตาม
2. เพิ่มไฟล์นั้นใน `.gitignore`
3. เอาออกจาก Git แต่เก็บไฟล์ไว้ในเครื่อง:
   ```bash
   git rm --cached .env
   git commit -m "chore: stop tracking .env"
   ```
4. ถ้าต้องลบออกจากประวัติทั้งหมด ใช้ [`git filter-repo`](https://github.com/newren/git-filter-repo) แล้ว force push
</details>

<details>
<summary><b>เพิ่มไฟล์ใน .gitignore แล้ว แต่ Git ยังเห็นไฟล์อยู่</b></summary>

เพราะไฟล์ถูก track ไปก่อนแล้ว ต้องเอาออกจาก index:

```bash
git rm -r --cached <ไฟล์หรือโฟลเดอร์>
git commit -m "chore: apply .gitignore"
```
</details>

<details>
<summary><b>push ไม่ได้: "rejected ... fetch first"</b></summary>

บน remote มี commit ใหม่ที่เครื่องเรายังไม่มี

```bash
git pull --rebase
git push
```
</details>

<details>
<summary><b>อยากยกเลิก merge ที่ conflict เต็มไปหมด</b></summary>

```bash
git merge --abort
```
</details>

---

<a id="pr-workflow"></a>

## 🔁 Workflow ส่ง Pull Request

```bash
# 1. Fork repo บน GitHub แล้ว clone fork ของตัวเอง
git clone https://github.com/<คุณ>/<repo>.git
cd <repo>
git remote add upstream https://github.com/<เจ้าของ>/<repo>.git

# 2. แตก branch ใหม่จาก main ล่าสุด
git fetch upstream
git switch -c fix/แก้อะไรสักอย่าง upstream/main

# 3. แก้โค้ด → commit → push
git add .
git commit -m "fix: อธิบายสิ่งที่แก้"
git push -u origin fix/แก้อะไรสักอย่าง

# 4. เปิด PR บน GitHub (หรือใช้ GitHub CLI)
gh pr create --fill
```

<a id="alias"></a>

## ⌨️ Alias ช่วยพิมพ์น้อยลง

```bash
git config --global alias.st "status -s"
git config --global alias.co switch
git config --global alias.br branch
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.undo "reset --soft HEAD~1"
```

ใช้งาน: `git st`, `git lg`, `git undo`

<a id="glossary"></a>

## 📖 ศัพท์ที่ควรรู้

| คำ | ความหมาย |
| :--- | :--- |
| **Repository (repo)** | โฟลเดอร์โปรเจกต์ที่ Git ติดตามประวัติ |
| **Working directory** | ไฟล์ที่เรากำลังแก้อยู่จริง ๆ |
| **Staging area / Index** | พื้นที่พักไฟล์ที่เตรียม commit (`git add`) |
| **Commit** | จุดบันทึกสถานะของโปรเจกต์ |
| **HEAD** | ตัวชี้ว่าตอนนี้เราอยู่ที่ commit ไหน |
| **Branch** | เส้นทางพัฒนาแยกออกมา |
| **Remote / origin** | repo บนเซิร์ฟเวอร์ เช่น GitHub (`origin` คือชื่อเริ่มต้น) |
| **upstream** | repo ต้นฉบับที่เรา fork มา |
| **Merge** | รวม branch เข้าด้วยกัน |
| **Rebase** | ย้าย commit ไปต่อบนฐานใหม่ |
| **Fork** | สำเนา repo คนอื่นมาไว้ในบัญชีเรา |
| **Pull Request (PR)** | คำขอให้เจ้าของ repo รวมโค้ดของเรา |

<a id="cherry-pick"></a>

## 🍒 Cherry-pick: หยิบ commit มาใส่

```bash
git cherry-pick <hash>            # หยิบ commit เดียวมาใส่ branch ปัจจุบัน
git cherry-pick <hash1> <hash2>   # หลาย commit
git cherry-pick A^..B             # ช่วง commit ตั้งแต่ A ถึง B (รวม A)
git cherry-pick -x <hash>         # ใส่หมายเหตุว่าหยิบมาจาก commit ไหน
git cherry-pick -n <hash>         # เอาแค่การแก้ไข ยังไม่ commit
git cherry-pick --continue        # หลังแก้ conflict เสร็จ
git cherry-pick --abort           # ยกเลิก
```

💡 เหมาะกับการเอา bug fix จาก branch หนึ่งไปใส่อีก branch โดยไม่ต้อง merge ทั้งหมด

---

## 🤝 ร่วมพัฒนา

เจอคำสั่งที่ผิด อธิบายไม่ชัด หรืออยากเพิ่มสถานการณ์ "พังแล้วทำไงดี" ใหม่ ๆ เปิด Issue หรือส่ง PR มาได้เลย ดู [CONTRIBUTING.md](https://github.com/winxtxrgit/git-cheatsheet-th/blob/main/CONTRIBUTING.md)

## 📄 License

[MIT](LICENSE) นำไปใช้ แจก หรือพิมพ์แปะผนังได้ตามสบาย
