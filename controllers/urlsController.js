import db from "../config/db.js"
import { nanoid } from "nanoid"
import SqlString from "sqlString"

const { VERBOSE } = process.env

export async function shortenUrl(req, res) {
  const { url } = req.body
  const { user } = res.locals

  const shortUrl = nanoid(10)

  try {
    const result = await db.query(
      `INSERT INTO urls (url, short_url, user_id ) VALUES ($1, $2, ${user.id})`,
      [url, shortUrl],
    )
    if (VERBOSE) console.log("🚀 ~ result", result)
  } catch (error) {
    if (VERBOSE) console.log("🚀 ~ error", error)
    if (error.code === "23505") return shortenUrl(req, res)
    return res.sendStatus(400)
  }

  res.send({ shortUrl: shortUrl })
}

export async function getUrl(req, res) {
  const { id } = req.params

  try {
    const result = await db.query(
      `SELECT urls.id, urls.short_url as "shortUrl", urls.url FROM urls WHERE urls.id = ${SqlString.escape(
        id,
      )}`,
    )
    if (VERBOSE) console.log("🚀 ~ result", result)

    if (result.rowCount === 0) return res.sendStatus(404)
    return res.send(result.rows[0])
  } catch (error) {
    if (VERBOSE) console.log("🚀 ~ error", error)
    return res.sendStatus(500)
  }
}

export async function openUrl(req, res) {
  const { shortUrl } = req.params

  try {
    const result = await db.query(
      `SELECT urls.url, urls.visits FROM urls WHERE urls.short_url = ${SqlString.escape(
        shortUrl,
      )}`,
    )
    if (VERBOSE) console.log("🚀 ~ result", result)

    if (result.rowCount === 0) return res.sendStatus(404)

    const { url, visits } = result.rows[0]
    console.log("🚀 ~ visits", visits)
    console.log("🚀 ~ url", url)

    const updated = await db.query(
      `UPDATE urls SET visits = ${
        visits + 1
      } WHERE urls.short_url = ${SqlString.escape(shortUrl)}`,
    )
    if (VERBOSE) console.log("🚀 ~ updated", updated)

    return res.redirect(url)
  } catch (error) {
    if (VERBOSE) console.log("🚀 ~ error", error)
    return res.sendStatus(500)
  }
}

export async function deleteUrl(req, res) {
  const { id } = req.params

  try {
    const result = await db.query(
      `DELETE FROM urls WHERE urls.id = ${SqlString.escape(id)}`,
    )
    if (VERBOSE) console.log("🚀 ~ result", result)

    if (result.rowCount === 0) return res.sendStatus(404)
    return res.send(204)
  } catch (error) {
    if (VERBOSE) console.log("🚀 ~ error", error)
    return res.sendStatus(500)
  }
}