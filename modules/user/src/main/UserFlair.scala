package lila.user

import play.api.libs.ws.StandaloneWSClient
import play.api.libs.ws.DefaultBodyReadables.*
import lila.common.config

opaque type UserFlair = String

object UserFlair extends OpaqueString[UserFlair]:

  type CategKey = String
  case class FlairCateg(key: CategKey, name: String)

  val categList: List[FlairCateg] = List(
    FlairCateg("smileys", "Smileys"),
    FlairCateg("people", "People"),
    FlairCateg("nature", "Animals & Nature"),
    FlairCateg("food-drink", "Food & Drink"),
    FlairCateg("activity", "Activity"),
    FlairCateg("travel-places", "Travel & Places"),
    FlairCateg("objects", "Objects"),
    FlairCateg("symbols", "Symbols"),
    FlairCateg("flags", "Flags")
  )

  final class Db(val list: List[UserFlair]):
    lazy val set: Set[UserFlair]                    = list.toSet
    lazy val categs: Map[CategKey, List[UserFlair]] = list.groupBy(_.takeWhile('.' != _))

  private var _db: Db                                       = Db(Nil)
  private[user] def updateDb(lines: Iterator[String]): Unit = _db = Db(UserFlair from lines.toList)

  def db                                = _db
  def exists(flair: UserFlair): Boolean = db.list.isEmpty || db.set(flair)

final private class UserFlairApi(ws: StandaloneWSClient, assetBaseUrl: config.AssetBaseUrl)(using Executor)(
    using
    scheduler: akka.actor.Scheduler,
    mode: play.api.Mode
):
  private val listUrl = s"$assetBaseUrl/assets/lifat/flair/list.txt"

  private def refresh: Funit =
    ws.url(listUrl).get() map:
      case res if res.status == 200 => UserFlair.updateDb(res.body[String].linesIterator)
      case _                        => logger.error(s"Cannot fetch $listUrl")

  scheduler.scheduleWithFixedDelay(51 seconds, 7 minutes): () =>
    refresh